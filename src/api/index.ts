import * as firebaseui from 'firebaseui'
import * as firebase from 'firebase/app'
import 'firebase/database'

import Team from 'models/team'
import Member from 'models/member'
import Question from 'models/question'
import Answer from 'models/answer'
import Answers from 'models/answers'
import User from 'models/user'
import Result from 'models/result'

import getResults from 'api/results'
import { getLatestQuestion, getQuestionAnswers } from 'api/helpers'

import * as moment from 'moment'
import { EventEmitter } from 'events'

export default class Api {
    // Api is a singleton service in this case
    static getInstance() {
        if (!Api.instance)
            Api.instance = new Api()

        return Api.instance
    }

    private emitter: EventEmitter = new EventEmitter()

    private state: {
        readonly user: User | null
        readonly users: User[]
        readonly team: Team | null
        readonly members: Member[]
        readonly questions: Question[]
        readonly answers: Answers[]
    }


    private static instance: Api
    private app: firebase.app.App
    private database: firebase.database.Database

    private ui: firebaseui.auth.AuthUI

    private config = {
        apiKey: "AIzaSyBxqTkwT_BM87TefrBgGL5DqIFdnGPupr4",
        authDomain: "quizzy-2ba94.firebaseapp.com",
        databaseURL: "https://quizzy-2ba94.firebaseio.com",
        projectId: "quizzy-2ba94",
        storageBucket: "quizzy-2ba94.appspot.com",
        messagingSenderId: "998358783561"
    }

    private authConfig: firebaseui.auth.Config = {
        signInSuccessUrl: 'l',
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID
        ],
        tosUrl: '/tos'
    }

    private constructor() {
        this.init()
    }

    init = () => {
        this.app = firebase.initializeApp(this.config)
        this.database = this.app.database()

        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        firebase.auth().onAuthStateChanged(user => {
            const mappedUser = this.mapUser(user)

            this.state = { ...this.state, user: mappedUser }
            if (mappedUser !== null) this.saveUser(mappedUser)
            this.emitter.emit('user', this.state.user)
        })

        this.state = {
            user: this.mapUser(firebase.auth().currentUser),
            users: [],
            questions: [],
            answers: [],
            members: [],
            team: null
        }
    }

    loggedIn = (): boolean => this.state.user !== null
    currentUser = () => this.state.user
    currentMember = () => this.state.members.find(x => x.user === this.state.user!.key)
    isAdmin = () => this.state.user !== null &&
        this.state.members !== null &&
        this.state.members.find(x => x.user === this.state.user!.key)!.isAdmin

    startFirebaseUi = (elementId: string, returnUrl: string) => {
        const instance = firebaseui.auth.AuthUI.getInstance()

        if (instance !== null)
            this.ui = instance
        else
            this.ui = new firebaseui.auth.AuthUI(firebase.auth())


        this.ui.start(elementId, { ...this.authConfig, signInSuccessUrl: returnUrl })
    }

    logOut = () => {
        firebase.auth().signOut()
    }

    private mapUser = (user: firebase.User | null): User | null => {
        if (user === null) return null

        const internalUser = {
            key: user.uid,
            name: user.displayName || '',
            email: user.email || '',
            avatarUrl: user.photoURL || 'https://cdn4.iconfinder.com/data/icons/defaulticon/icons/png/256x256/help.png'
        }

        return internalUser
    }

    subscribe = <T>(event: keyof Api['state'], callback: (newData: T) => void) => {
        this.emitter.addListener(event, callback)
    }

    loadFor = async (teamKey: string) => {
        // should load in that particular sequence. Can't do promise.all
        await this.bind(`teams/${teamKey}`, 'team')
        await this.bind(`members/${teamKey}`, 'members', this.firebaseArrayBinder)
        await this.bind(`users`, 'users', this.firebaseArrayBinder)
        await this.bind(`questions/${teamKey}`, 'questions', this.firebaseArrayBinder)
        await this.bind(`answers/${teamKey}`, 'answers', this.answersBinder)

        console.log('finished binding stuff')
        return this.state
    }

    private bind = async (
        path: string,
        item: keyof Api['state'],
        customBinder: (snap: firebase.database.DataSnapshot | null) => any = (snap) => snap !== null ? snap.val() : null
    ) => {
        console.log(`b: ${item}`)
        this.database.ref(path).on('value', snap => {
            this.state = { ...this.state, [item]: customBinder(snap) }
            this.emitter.emit(item, this.state[item])
        })
    }

    private firebaseArrayBinder = (snap: firebase.database.DataSnapshot | null) => snap !== null
        ? this.arrayBinder(snap.val())
        : null

    private arrayBinder = (obj: object) => Object.keys(obj || {}).map(k => ({ ...obj[k], key: k }))

    private answersBinder = (snap: firebase.database.DataSnapshot | null) => snap !== null
        ? Object.keys(snap.val() || {}).map(k => (
            {
                answers: this.arrayBinder(snap.val()[k]),
                questionKey: k
            } as Answers))
        : null

    // DATABASE

    requestInvalid = () => {
        if (!this.loggedIn())
            return true

        if (this.database === undefined)
            throw new Error('Please, init API first byt calling .init()!')

        return false
    }

    createTeam = async (team: Team): Promise<void> => {
        if (this.requestInvalid())
            return

        await this.create<Team>('teams', team)

        await this.saveUser(this.state.user!)

        return this.createMember({
            key: '',
            name: this.state.user!.name,
            user: this.state.user!.key,
            inviteEmail: this.state.user!.email,
            team: team.key,
            points: 0,
            isAdmin: true
        })
    }

    saveUser = async (user: User): Promise<void> => {
        if (this.requestInvalid())
            return

        return this.database.ref(`users/${user.key}`).set(user)
    }

    createMember = async (member: Member): Promise<any> => {
        if (this.requestInvalid())
            return

        return this.database.ref(`members`).child(member.team).push(member)
    }

    saveMember = async (member: Member): Promise<void> => {
        if (this.requestInvalid())
            return

        return this.database.ref(`members/${member.team}/${member.key}`).set(member)
    }

    createQuestion = async (question: Question) => {
        if (this.requestInvalid())
            return

        const result = await this.database.ref(`questions`)
            .child(question.team)
            .push(question)
            .once('value')

        if (result.key === null)
            return

        return this.createEmptyAnswers(question.team, result.key)
    }

    saveQuestion = async (question: Question) => {
        if (this.requestInvalid())
            return

        if (this.state.answers === null)
            throw new Error('Ups! That should not happen!')

        const questionToUpdate = this.state.questions.find(x => x.key === question.key)

        if (questionToUpdate !== undefined) {
            // update stuff
            // if answer was already existing, then we should remove old score before adding new ones 
            if (questionToUpdate.answer !== null && questionToUpdate.answer !== undefined) {
                // get scores for previous answer
                const previousResult = getResults(questionToUpdate, getQuestionAnswers(question.key, this.state.answers).answers, this.state.members)
                const promises = []

                // remove points from members
                for (const res of previousResult) {
                    const member = { ...res.member, points: res.member.points - res.points } as Member
                    promises.push(this.saveMember(member))
                }

                // await removal
                await Promise.all(promises)
            }
        }

        await this.database.ref(`questions/${question.team}/${question.key}`).set(question)

        if (question.answer !== null && question.answer !== undefined) {
            // get scores for the new answer
            const results = getResults(question, getQuestionAnswers(question.key, this.state.answers).answers, this.state.members)

            // add points to members
            for (const res of results) {
                const member = { ...res.member, points: res.member.points + res.points } as Member
                this.saveMember(member)
            }
        }
    }

    saveAnswer = async (question: string, answer: Answer) => {
        if (this.database === undefined)
            throw new Error('Please, init API first byt calling .init()!')

        const result = await this.database.ref(`answers/${answer.team}/${question}/${answer.key}`).set(answer)
    }

    private createEmptyAnswers = async (team: string, question: string): Promise<void> => {
        if (this.database === undefined)
            throw new Error('Please, init API first byt calling .init()!')

        const promises = []

        for (const member of this.state.members) {
            const answers = getQuestionAnswers(question, this.state.answers).answers

            if (answers.find(x => x.author === member.key && x.question === question) !== undefined)
                continue

            const answer = {
                answer: null,
                author: member.key,
                question,
                team,
                shouldAnswer: true,
                key: ''
            } as Answer

            promises.push(this.database.ref(`answers`)
                .child(team)
                .child(question)
                .push(answer))
        }

        await Promise.all(promises)
    }

    private create = async <T extends { key: string }>(table: string, data: T) => {
        if (this.database === undefined)
            throw new Error('Please, init API first byt calling .init()!')

        return this.database.ref(`${table}/${data.key}`).set(data)
    }
}
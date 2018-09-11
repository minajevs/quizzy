import * as firebase from 'firebase/app'
import 'firebase/database'

import Team from 'models/team'
import Member from 'models/member'
import Question from 'models/question'
import Answer from 'models/answer'
import Answers from 'models/answers'
import Result from 'models/result'

import getResults from 'api/results'
import {getLatestQuestion, getQuestionAnswers} from 'api/helpers'

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
        readonly team?: Team | null
        readonly members: Member[]
        readonly questions: Question[]
        readonly answers: Answers[]
    }


    private static instance: Api
    private app: firebase.app.App
    private database: firebase.database.Database
    private config = {
        apiKey: "AIzaSyBxqTkwT_BM87TefrBgGL5DqIFdnGPupr4",
        authDomain: "quizzy-2ba94.firebaseapp.com",
        databaseURL: "https://quizzy-2ba94.firebaseio.com",
        projectId: "quizzy-2ba94",
        storageBucket: "quizzy-2ba94.appspot.com",
        messagingSenderId: "998358783561"
    }

    private constructor() {
        this.init()
    }

    init = () => {
        this.app = firebase.initializeApp(this.config)
        this.database = this.app.database()

        this.state = {
            questions: [],
            answers: [],
            members: [],
            team: null
        }
    }

    subscribe = <T>(event: keyof Api['state'], callback: (newData: T) => void) => {
        this.emitter.addListener(event, callback)
    }

    loadFor = async (teamKey: string) => {
        await Promise.all([
            this.bind(`teams/${teamKey}`, 'team'),
            this.bind(`members/${teamKey}`, 'members', this.firebaseArrayBinder),
            this.bind(`questions/${teamKey}`, 'questions', this.firebaseArrayBinder),
            this.bind(`answers/${teamKey}`, 'answers', this.answersBinder)
        ])
     
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
            {   answers: this.arrayBinder(snap.val()[k]), 
                questionKey: k 
            } as Answers))
        : null

    createTeam = async (team: Team): Promise<void> => {
        return this.create<Team>('teams', team)
    }

    createMember = async (member: Member): Promise<void> => {
        if (this.database === undefined)
            throw new Error('Please, init API first byt calling .init()!')

        return this.database.ref(`members`).child(member.team).push(member)
    }

    saveMember = async (member: Member): Promise<void> => {
        if (this.database === undefined)
            throw new Error('Please, init API first byt calling .init()!')

        return this.database.ref(`members/${member.team}/${member.key}`).set(member)
    }

    createQuestion = async (question: Question) => {
        if (this.database === undefined)
            throw new Error('Please, init API first byt calling .init()!')

        const result = await this.database.ref(`questions`)
            .child(question.team)
            .push(question)
            .once('value')

        if (result.key === null)
            return

        return this.createEmptyAnswers(question.team, result.key)
    }

    saveQuestion = async (question: Question) => {
        if (this.database === undefined)
            throw new Error('Please, init API first byt calling .init()!')

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
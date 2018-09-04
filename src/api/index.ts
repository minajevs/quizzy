import * as firebase from 'firebase/app'
import 'firebase/database'

import Team from 'models/team'
import Member from 'models/member'
import Question from 'models/question'
import Answer from 'models/answer'
import Result from 'models/result'

import getResults from 'api/results'

import * as moment from 'moment'

export default class Api {
    // Api is a singleton service in this case
    static getInstance() {
        if (!Api.instance)
            Api.instance = new Api()

        return Api.instance
    }
    private static instance: Api

    private app: firebase.app.App
    private database: firebase.database.Database
    private teams: firebase.database.Reference
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

        this.teams = this.database.ref('teams')
    }

    createTeam = async (team: Team) => {
        return this.create<Team>('teams', team)
    }

    getTeam = async (key: string): Promise<Team> => {
        return await this.getValue<Team>(`teams/${key}`)
    }

    createMember = async (member: Member) => {
        if (this.database === undefined)
            throw new Error('Please, init API first byt calling .init()!')

        const result = await this.database.ref(`members`).child(member.team).push(member)
    }

    saveMember = async (member: Member) => {
        if (this.database === undefined)
            throw new Error('Please, init API first byt calling .init()!')

        const existing = await this.getValue<Member>(`members/${member.team}/${member.key}`)

        if (existing === null)
            return

        const result = await this.database.ref(`members/${member.team}/${member.key}`).set(member)
    }

    getMembersOfTeam = async (team: string): Promise<Member[]> => {
        const members = await this.getValue<Member[]>(`members/${team}`) as {}
        if (members === null)
            return []

        const values = Object.keys(members).map(key => ({ ...members[key], key } as Member))

        return values
    }

    createQuestion = async (question: Question) => {
        if (this.database === undefined)
            throw new Error('Please, init API first byt calling .init()!')

        const result = await this.database.ref(`questions`).child(question.team).push(question)
    }

    saveQuestion = async (question: Question) => {
        if (this.database === undefined)
            throw new Error('Please, init API first byt calling .init()!')

        // search for question

        const existing = await this.getValue<Question>(`questions/${question.team}/${question.key}`)

        if (existing === null)
            return

        // upadate scores

        let members = await this.getMembersOfTeam(question.team)
        const answers = await this.getAnswersOfTeam(question.team, question.key)

        // if answer was already existing, then we should remove old score before adding new ones 
        if(existing.answer !== null && existing.answer !== undefined){
            // get scores for previous answer
            const previousResult = getResults(existing, answers, members)
            const promises = []
            
            // remove points from members
            for(const res of previousResult){
                const member = {...res.member, points: res.member.points - res.points} as Member
                promises.push(this.saveMember(member))
            }

            // await removal
            await Promise.all(promises)
            members = await this.getMembersOfTeam(question.team)
        }

        // update question
        const result = await this.database.ref(`questions/${question.team}/${question.key}`).set(question)

        // get scores for the new answer
        const results = getResults(question, answers, members)

        // add points to members
        for(const res of results){
            const member = {...res.member, points: res.member.points + res.points} as Member
            this.saveMember(member)
        }
    }

    getQuestionOfTeam = async (team: string): Promise<Question[]> => {
        const questions = await this.getValue<Question[]>(`questions/${team}`) as {}
        if (questions === null)
            return []

        const values = Object.keys(questions).map(key => ({ ...questions[key], key } as Question))
        const members = await this.getMembersOfTeam(team)

        const valuesWithMembers = values.map(question => ({
            ...question,
            authorName: (members.find(x => x.key === question.author) || { name: `ERR: Can't find member with id` }).name
        } as Question))

        return valuesWithMembers
    }

    getLatestQuestion = async (team: string): Promise<Question> => {
        const questions = await this.getQuestionOfTeam(team)

        if (questions === null) return new Question()

        const sorted = questions.sort((a, b) => moment(b.date).diff(moment(a.date)))

        return sorted[0]
    }

    saveAnswer = async (question: string, answer: Answer) => {
        if (this.database === undefined)
            throw new Error('Please, init API first byt calling .init()!')
        
        const result = await this.database.ref(`answers/${answer.team}/${question}/${answer.key}`).set(answer)
    }

    getAnswersOfTeam = async (team: string, question: string): Promise<Answer[]> => {
        await this.createEmptyAnswers(team, question)

        const answers = await this.getValue<Question[]>(`answers/${team}/${question}`) as {}

        const values = Object.keys(answers).map(key => ({ ...answers[key], key } as Answer))
        const members = await this.getMembersOfTeam(team)

        const valuesWithMembers = values.map(answer => ({
            ...answer,
            authorName: (members.find(x => x.key === answer.author) || { name: `ERR: Can't find member with id` }).name
        } as Answer))

        return valuesWithMembers
    }

    private createEmptyAnswers = async (team: string, question: string): Promise<void> => {
        if (this.database === undefined)
            throw new Error('Please, init API first byt calling .init()!')

        const existing = await this.getValue<Question>(`answers/${team}/${question}`)

        if (existing !== null)
            return

        const members = await this.getMembersOfTeam(team)
        const promises = []

        for (const member of members) {

            const existingAnswer = await this.getValue<Answer>(`answers/${team}/${question}/${member.key}`)
            
            if(existingAnswer !== null && existingAnswer !== undefined)
                continue

            const answer = {
                answer: null,
                author: member.key,
                team,
                key: ''
            } as Answer

            promises.push(this.database.ref(`answers`)
                .child(team)
                .child(question)
                .push(answer))
        }

        await Promise.all(promises)
    }

    private getValue = async <T>(path: string): Promise<T> => {
        const snapshot = await this.database.ref(path).once('value')
        const value = snapshot.val() as T

        return value
    }

    private create = async <T extends { key: string }>(table: string, data: T) => {
        if (this.database === undefined)
            throw new Error('Please, init API first byt calling .init()!')

        const existing = await this.getValue<T>(`${table}/${data.key}`)

        if (existing !== null)
            return

        const result = await this.database.ref(`${table}/${data.key}`).set(data)
    }
}
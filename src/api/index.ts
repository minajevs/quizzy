import * as moment from 'moment'

import Core from 'api/core'

import Team from 'models/team'
import Member from 'models/member'
import Question from 'models/question'
import Answer from 'models/answer'
import User from 'models/user'
import Result from 'models/result'

import getResults from 'api/results'
import Answers from 'models/answers'

const core = () => Core.getInstance()

export const subscribe = core().subscribe

export const AppApi = {
    loggedIn: () => core().state.user !== null,
    currentUser: () => core().state.user,
    logOut: core().logOut,
    load: core().bindTeam,
    saveUser: async (user: User) => {
        return core().setData("users", user)
    },
    createTeam: async (team: Team) => {
        const currentUser = AppApi.currentUser()
        if (currentUser === null) return

        // save team to db
        await core().setData("teams", team)
        // save user to db
        await AppApi.saveUser(currentUser)
        // create initial member for current user
        return MembersApi.save({
            key: '',
            name: currentUser.name,
            user: currentUser.key,
            inviteEmail: currentUser.email,
            team: team.key,
            points: 0,
            isAdmin: true
        })
    }
}

export const MembersApi = {
    save: async (member: Member) => core().createOrUpdate('members', member)
}

export const AnswersApi = {
    save: async (answers: Answers) => {
        core().createOrUpdate('answers', answers)
    },
    getForQuestion: (questionKey: string) => {
        const { answers } = core().state

        if (answers === null) return null

        const questionAnswers = answers.find(x => x.questionKey === questionKey)
        if (questionAnswers === undefined) return null

        return questionAnswers
    },
    latestAnswers: () => {
        const latestQuestion = QuestionsApi.getLatestQuestion()
        if (latestQuestion === null) return null

        return AnswersApi.getForQuestion(latestQuestion.key)
    },
    addAnswer: async (answer: Answer) => {
        const latestAnswers = AnswersApi.latestAnswers()
        if (latestAnswers === null) return

        const { answers } = latestAnswers

        const newAnswers = answers.map(x => x.key === answer.key ? { ...answer } : x)

        AnswersApi.save({ ...latestAnswers, answers: newAnswers })
    },
    createEmptyAnswers: async (teamKey: string, questionKey: string) => {
        const { members } = core().state
        if (members === null) return

        const answers: Answers = {
            key: '',
            team: teamKey,
            questionKey,
            answers: members.map(member => ({
                answer: null,
                author: member.key,
                question: questionKey,
                team: teamKey,
                shouldAnswer: true,
                key: core().generateKey()
            }))
        }

        return AnswersApi.save(answers)
    }
}

export const QuestionsApi = {
    create: async (question: Question) => {
        const result = core().create('questions', question)
        if (result === undefined) return

        const newQuestion = await result.once('value')

        if (newQuestion.key === null) return

        return AnswersApi.createEmptyAnswers(question.team, newQuestion.key)
    },
    save: async (question: Question) => {
        const questions = core().state.questions!
        const members = core().state.members!
        const existingQuestion = questions.find(x => x.key === question.key)

        // Question exists
        if (existingQuestion !== undefined) {
            const questionAnswers = AnswersApi.getForQuestion(existingQuestion.key)
            if (questionAnswers !== null && existingQuestion.answer !== null) {
                // If answer existed, first remove points for scores, because we will calculate a new ones
                const previousResult = getResults(
                    existingQuestion,
                    questionAnswers,
                    [...members])

                const promises = previousResult.map(x =>
                    MembersApi.save({ ...x.member, points: x.member.points - x.points }))

                await Promise.all(promises)
            }
        }

        // Update question in db
        await core().createOrUpdate('questions', question)

        // Update scores if answer is there
        const answers = AnswersApi.getForQuestion(question.key)
        if (answers !== null && question.answer !== null) {
            const results = getResults(
                question,
                answers,
                [...members]
            )

            const promises = results.map(x => MembersApi.save({ ...x.member, points: x.member.points + x.points }))
            await Promise.all(promises)
        }
    },
    getLatestQuestion: (): Question | null => {
        const { questions } = core().state
        if (questions === null) return null
        return [...questions]
            .sort((a, b) => moment(b.date).diff(moment(a.date)))[0] || null
    }
}
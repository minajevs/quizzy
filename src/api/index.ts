import * as moment from 'moment'

import Core from 'api/core'

import Team from 'models/team'
import Member from 'models/member'
import Question from 'models/question'
import Answer from 'models/answer'
import User from 'models/user'
import Result from 'models/result'

import getResults from 'api/results'

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
    save: async (answer: Answer) => core().createOrUpdate('answers', answer),
    getForQuestion: (questionKey: string) => {
        const { answers } = core().state

        if (answers === null) return []

        const questionAnswers = answers.filter(x => x.question === questionKey)
        if (questionAnswers === undefined) return []

        return questionAnswers
    },
    createEmptyAnswers: async (teamKey: string, questionKey: string) => {
        const { members } = core().state
        if (members === null) return

        const promises = members.map(member => {
            const answer = {
                answer: null,
                author: member.key,
                question: questionKey,
                team: teamKey,
                shouldAnswer: true,
                key: ''
            }
            return AnswersApi.save(answer)
        })

        return Promise.all(promises)
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
            if (existingQuestion.answer !== null) {
                // If answer existed, first remove points for scores, because we will calculate a new ones
                const previousResult = getResults(
                    existingQuestion,
                    AnswersApi.getForQuestion(existingQuestion.key),
                    [...members])

                const promises = previousResult.map(x =>
                    MembersApi.save({ ...x.member, points: x.member.points - x.points }))

                await Promise.all(promises)
            }
        }

        // Update question in db
        await core().createOrUpdate('questions', question)

        // Update scores if answer is there
        if (question.answer !== null) {
            const results = getResults(
                question,
                AnswersApi.getForQuestion(question.key),
                [...members]
            )

            const promises = results.map(x => MembersApi.save({ ...x.member, points: x.member.points + x.points }))
            await Promise.all(promises)
        }
    },
    getLatestQuestion: (questions: Question[]): Question | null => {
        return questions
            .sort((a, b) => moment(b.date).diff(moment(a.date)))[0] || null
    }
}
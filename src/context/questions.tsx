import * as React from 'react'
import createStoreContext from 'react-concise-state'

import { QuestionsApi, subscribe } from 'api/index'

import { context as teamContext } from 'context/team'

import QuestionModel from 'models/question'

export const [context, Provider] = createStoreContext({
    questions: null as QuestionModel[] | null,
    latestQuestion: null as QuestionModel | null
}, ({ setState, meta, stores }) => ({
    init: () => {
        subscribe('questions', data => {
            if (data === null) return
            const questions = [...data]

            const latestQuestion = meta.api.getLatestQuestion(questions)
            setState({ questions, latestQuestion })
        })
    },
    addQuestion: async (question: QuestionModel) => {
        stores.team.setLoading(true)
        await meta.api.create({ ...question, team: stores.team.team!.key })
        stores.team.setLoading(false)
    },
    saveQuestion: async (question: QuestionModel) => {
        stores.team.setLoading(true)
        await meta.api.save(question)
        stores.team.setLoading(false)
    },
}), {
    contexts: {
        team: teamContext
    },
    meta: { api: QuestionsApi }
}) 
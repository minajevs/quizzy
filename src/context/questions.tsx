import * as React from 'react'
import createStoreContext from 'react-concise-state'

import { QuestionsApi, subscribe } from 'api/index'

import { context as teamContext } from 'context/team'

import QuestionModel from 'models/question'

export const [context, Provider] = createStoreContext({
    questions: null as QuestionModel[] | null,
    latestQuestion: null as QuestionModel | null,
    initialized: false
}, ({ setState, meta, stores, state }) => ({
    init: () => {
        if (state.initialized) return
        subscribe('questions', data => {
            if (data === null) return
            const questions = [...data]

            const latestQuestion = meta.api.getLatestQuestion()
            setState(prev => ({ ...prev, questions, latestQuestion, initialized: true }))
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
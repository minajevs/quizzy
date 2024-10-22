import * as React from 'react'
import createStoreContext from 'react-concise-state'

import { AnswersApi, subscribe } from 'api'

import { context as teamContext } from 'context/team'

import AnswersModel from 'models/answers'
import AnswerModel from 'models/answer'

export const [context, Provider] = createStoreContext({
    answers: null as AnswersModel[] | null,
    initialized: false
}, ({ setState, meta, stores, state }) => ({
    init: () => {
        if (state.initialized) return
        // gets ALL answers for ALL questions
        subscribe('answers', answers => {
            console.log(answers)
            if (answers === null)
                setState({ answers: null, initialized: true })
            else
                setState({ answers: [...answers], initialized: true })
        })
    },
    getAnswers: (questionKey: string) => meta.api.getForQuestion(questionKey),
    addAnswer: async (answer: AnswerModel) => {
        await meta.api.addAnswer(answer)
    }
}), {
    contexts: {
        team: teamContext
    },
    meta: { api: AnswersApi }
}) 
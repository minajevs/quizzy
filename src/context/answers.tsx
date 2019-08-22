import * as React from 'react'
import createStoreContext from 'react-concise-state'

import { AnswersApi, subscribe } from 'api'

import { context as teamContext } from 'context/team'

import AnswerModel from 'models/answer'

export const [context, Provider] = createStoreContext({
    answers: null as AnswerModel[] | null,
}, ({ setState, meta, stores, state }) => ({
    init: () => {
        // gets ALL answers for ALL questions
        subscribe('answers', answers => setState({ answers: answers && [...answers] }))
    },
    getAnswers: (questionKey: string) => meta.api.getForQuestion(questionKey),
    addAnswer: async (answer: AnswerModel) => {
        await meta.api.save(answer)
    }
}), {
    contexts: {
        team: teamContext
    },
    meta: { api: AnswersApi }
}) 
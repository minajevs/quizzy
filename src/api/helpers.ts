import Question from 'models/question'
import Answer from 'models/answer'
import Answers from 'models/answers'

import * as moment from 'moment'

export const getLatestQuestion = (questions: Question[]): Question | null => {
    return questions
            .sort((a, b) => moment(b.date).diff(moment(a.date)))[0] || null
}

export const getQuestionAnswers = (questionKey: string, answers: Answers[]): Answers => 
    answers.find(x => x.questionKey === questionKey) || {questionKey, answers: []}

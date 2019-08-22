import Result from 'models/result'
import Member from 'models/member'
import Question from 'models/question'
import Answers from 'models/answers'

const getResults = (question: Question, answers: Answers, members: Member[]) => {
    if (question.units === 'manual')
        return []

    const results: Result[] = answers.answers.map(answer => {
        const member = members.find(x => x.key === answer.author) || { name: `ERR: Can't find member with id` } as Member

        if (!answer.shouldAnswer)
            return { member, score: 0, points: 0, isAuthor: false, shouldAnswer: false }

        if (answer.answer === null || answer.answer === undefined)
            return { member, score: -1, points: 0, isAuthor: false, shouldAnswer: true }

        const givenAnswer = (answer.answer as number)
        const realAnswer = question.answer as number

        const difference = Math.abs(realAnswer - givenAnswer)

        return { member, difference, points: 0, answer: givenAnswer, isAuthor: false, shouldAnswer: true }
    })

    const sortedResults = results.sort((a, b) => {
        if (a.difference === undefined) return 1
        if (b.difference === undefined) return -1

        return (+a.difference) - (+b.difference)
    })

    for (let i = sortedResults.length; i > 0; i--) {
        const index = sortedResults.length - i
        const res = sortedResults[index]

        if (!res.shouldAnswer) {
            res.points = 0
            continue
        }

        if (res.member.key === question.author) {
            res.points = 0
            res.isAuthor = true
            continue
        }

        if (index > 0) {
            const previousRes = sortedResults[index - 1]
            if (res.difference === previousRes.difference && res.score !== -1) {
                res.points = previousRes.points
                continue
            }
        }

        if (res.score === -1) {
            res.points = -1
            continue
        }

        res.points = i - 1
    }

    return sortedResults
}

export default getResults
import Result from 'models/result'
import Member from 'models/member'
import Question from 'models/question'
import Answer from 'models/answer'

const getResults = (question: Question, answers: Answer[], members: Member[]) => {
    const results: Result[] = answers.map(answer => {
        const member = members.find(x => x.key === answer.author) || { name: `ERR: Can't find member with id` } as Member
        
        if(answer.answer === null || answer.answer === undefined)
            return {member, score: -1, points: 0, isAuthor: false}
        
        const realAnswer = question.answer as number

        const difference = Math.abs(realAnswer-answer.answer)

        return {member, difference, points: 0, answer: answer.answer, isAuthor: false}
    })

    const sortedResults = results.sort((a,b) => {
        if(a.difference === undefined) return 1
        if(b.difference === undefined) return -1

        return a.difference > b.difference ? 1 : 0
    })

    for(let i = sortedResults.length; i > 0; i--){
        const index = sortedResults.length-i
        const res = sortedResults[index]

        if(res.member.key === question.author){
            res.points = 0
            res.isAuthor = true
            continue
        }

        if(index > 0){
            const previousRes = sortedResults[index-1]
            if(res.difference === previousRes.difference && res.score !== -1){
                res.points = previousRes.points
                continue
            } 
        }

        if(res.score === -1){
            res.points = -1
            continue
        }

        res.points = i-1                
    }

    console.log(sortedResults)

    return sortedResults
}

export default getResults
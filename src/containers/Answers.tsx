import * as React from 'react'
import AnswerModel from 'models/answer'
import QuestionModel from 'models/question'
import MemberModel from 'models/member'

import AnswersComponent from 'components/Answers'
import ResultsComponent from 'components/Results'
import Loading from 'components/Loading'

import getResults from 'api/results'

type Props = {
    answers?: AnswerModel[]
    members?: MemberModel[]
    latestQuestion?: QuestionModel
    getLatestQuestion: () => Promise<void>
    getAnswers: () => Promise<void>
    addAnswer: (question: string, answer: AnswerModel) => Promise<void>
}

class Answers extends React.Component<Props> {
    constructor(props: Props) {
        super(props)
        this.loadData()
    }

    public render() {
        const { answers, members, latestQuestion } = this.props

        if (answers === undefined)
            return Loading('answers')

        if (members === undefined)
            return Loading('members')

        if (latestQuestion === undefined)
            return null // Loading()

        if(latestQuestion.answer !== null && latestQuestion.answer !== undefined){
            const results = getResults(latestQuestion, answers, members)
            return <ResultsComponent 
                question={latestQuestion}
                results={results.filter(result => !result.isAuthor)}
            />
        }

        return <AnswersComponent
            question={latestQuestion}
            answers={answers}
            onAddAnswer={this.addAnswer}
        />
    }

    private loadData = async () => {
        const { getAnswers, getLatestQuestion, latestQuestion } = this.props

        await getLatestQuestion()
        
        await getAnswers()
    }

    private addAnswer = async (answer: AnswerModel) => {
        await this.props.addAnswer((this.props.latestQuestion as QuestionModel).key, answer)
        this.loadData()
    }
}

export default Answers
import * as React from 'react'

import QuestionModel from 'models/question'
import MemberModel from 'models/member'
import AnswerModel from 'models/answer'

import QuestionsComponent from 'components/Questions'
import Loading from 'components/Loading'

type Props = {
    teamKey: string
    members?: MemberModel[]
    answers?: AnswerModel[]
    questions?: QuestionModel[]
    addQuestion: (question: QuestionModel) => Promise<void>
    saveQuestion: (question: QuestionModel) => Promise<void>
}

class Questions extends React.Component<Props> {
    state = {questions: undefined, members: undefined}
    public render() {
        const { teamKey, questions, members, answers } = this.props

        if (questions === undefined)
            return Loading('questions')

        return <QuestionsComponent 
            teamKey={teamKey}
            questions={questions} 
            answers={answers || []}
            members={members || []}
            onAddQuestion={this.addQuestion}
            onSaveQuestion={this.saveQuestion}
            />
    }

    private addQuestion = async (question: QuestionModel) => {
        await this.props.addQuestion(question)
    }

    private saveQuestion = async (question: QuestionModel) => {
        await this.props.saveQuestion(question)
    }
}

export default Questions
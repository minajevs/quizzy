import * as React from 'react'

import QuestionModel from 'models/question'
import MemberModel from 'models/member'
import AnswersModel from 'models/answers'

import QuestionsComponent from 'components/Questions'
import Loading from 'components/Loading'

type Props = {
    teamKey: string
    members: MemberModel[] | null
    answers: AnswersModel[] | null
    questions: QuestionModel[] | null
    addQuestion: (question: QuestionModel) => Promise<void>
    saveQuestion: (question: QuestionModel) => Promise<void>
}

class Questions extends React.Component<Props> {
    public render() {
        const { teamKey, questions, members, answers } = this.props

        if (questions === null)
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
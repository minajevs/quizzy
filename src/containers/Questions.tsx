import * as React from 'react'
import QuestionModel from 'models/question'
import MemberModel from 'models/member'
import QuestionsComponent from 'components/Questions'
import Loading from 'components/Loading'

type Props = {
    teamKey: string
    members?: MemberModel[]
    questions?: QuestionModel[]
    getMembers: () => Promise<void>
    getQuestions: () => Promise<void>
    addQuestion: (question: QuestionModel) => Promise<void>
    saveQuestion: (question: QuestionModel) => Promise<void>
}

class Questions extends React.Component<Props> {
    constructor(props: Props) {
        super(props)
        this.state = {questions: undefined, members: undefined}
        this.loadData()
    }

    public render() {
        const { teamKey, questions, members } = this.props

        if (questions === undefined)
            return Loading('questions')

        return <QuestionsComponent 
            teamKey={teamKey}
            questions={questions} 
            onAddQuestion={this.addQuestion}
            onSaveQuestion={this.saveQuestion}
            members={members || []}
            />
    }

    private loadData = async () => {
        const { getQuestions, getMembers } = this.props
        await getQuestions()
        await getMembers()
    }

    private addQuestion = async (question: QuestionModel) => {
        await this.props.addQuestion(question)
        this.loadData()
    }

    private saveQuestion = async (question: QuestionModel) => {
        await this.props.saveQuestion(question)
        this.loadData()
    }
}

export default Questions
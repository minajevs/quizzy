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

const Questions: React.FC<Props> = props => {
    const { teamKey, questions, members, answers } = props

    const addQuestion = React.useCallback(async (question: QuestionModel) => {
        await props.addQuestion(question)
    }, [props.addQuestion])

    const saveQuestion = React.useCallback(async (question: QuestionModel) => {
        await props.saveQuestion(question)
    }, [props.saveQuestion])

    if (questions === null)
        return Loading('questions')

    return <QuestionsComponent
        teamKey={teamKey}
        questions={questions}
        answers={answers || []}
        members={members || []}
        onAddQuestion={addQuestion}
        onSaveQuestion={saveQuestion}
    />
}

export default Questions
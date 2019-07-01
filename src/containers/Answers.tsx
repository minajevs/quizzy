import * as React from 'react'

import { getQuestionAnswers } from 'api/helpers'
import AnswersModel from 'models/answers'
import AnswerModel from 'models/answer'
import QuestionModel from 'models/question'
import MemberModel from 'models/member'
import UserModel from 'models/user'

import AnswersComponent from 'components/Answers'
import ResultsComponent from 'components/Results'
import Loading from 'components/Loading'

import getResults from 'api/results'

import { Container, Segment } from 'semantic-ui-react'

type Props = {
    answers: AnswersModel[] | null
    members: MemberModel[] | null
    user: UserModel | null
    latestQuestion: QuestionModel | null
    addAnswer: (question: string, answer: AnswerModel) => Promise<void>
}

class Answers extends React.Component<Props> {
    public render() {
        const { answers, members, latestQuestion, user } = this.props

        if (latestQuestion === null)
            return (
                <Container>
                    <Segment>
                        No questions yet
                    </Segment>
                </Container>
            )

        if (answers === null)
            return Loading('answers')

        if (members === null)
            return Loading('members')

        if (user === null)
            return Loading('user')

        const latestAnswers = getQuestionAnswers(latestQuestion.key, answers)

        if (latestQuestion.answer !== null && latestQuestion.answer !== undefined) {
            const results = getResults(latestQuestion, latestAnswers.answers, members)
            return <ResultsComponent
                question={latestQuestion}
                results={results.filter(result => !result.isAuthor)}
            />
        }

        return <AnswersComponent
            question={latestQuestion}
            answers={latestAnswers.answers}
            members={members}
            user={user}
            onAddAnswer={this.addAnswer}
        />
    }

    private addAnswer = async (answer: AnswerModel) => {
        await this.props.addAnswer((this.props.latestQuestion as QuestionModel).key, answer)
    }
}

export default Answers
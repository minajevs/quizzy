import * as React from 'react'

import QuestionModel from 'models/question'
import MemberModel from 'models/member'
import AnswerModel from 'models/answer'

import QuestionComponent from 'components/Question'
import AddQuestionModal from 'components/AddQuestionModal'

import * as moment from 'moment'

import { Segment, Container, Item, List, Label, Image } from 'semantic-ui-react'

type Props = {
  questions: QuestionModel[]
  members: MemberModel[]
  answers: AnswerModel[]
  teamKey: string
  onAddQuestion: (member: QuestionModel) => void
  onSaveQuestion: (member: QuestionModel) => void
}

class Members extends React.Component<Props> {
  public render() {
    const { questions, teamKey, members, answers, onAddQuestion, onSaveQuestion } = this.props

    return (
      <Container>
        <Segment>
          <AddQuestionModal
            teamKey={teamKey}
            onAdd={onAddQuestion}
            members={members}
          />
          <Item.Group divided={true}>
            {questions
              .sort(this.sortByDate)
              .map((question, index) =>
                (<QuestionComponent
                  question={question}
                  answers={answers}
                  members={members}
                  key={index}
                  onSaveQuestion={onSaveQuestion} />)
              )}
          </Item.Group>
        </Segment>
      </Container>
    )
  }

  private sortByDate = (a: QuestionModel, b: QuestionModel) => moment(b.date).diff(moment(a.date))
}

export default Members
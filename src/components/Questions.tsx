import * as React from 'react'

import { getLatestQuestion, getQuestionAnswers } from 'api/helpers'

import QuestionModel from 'models/question'
import MemberModel from 'models/member'
import AnswersModel from 'models/answers'

import QuestionComponent from 'components/Question'
import AddQuestionModal from 'components/AddQuestionModal'

import * as moment from 'moment'

import { Segment, Container, Item, List, Label, Image } from 'semantic-ui-react'

type Props = {
  questions: QuestionModel[]
  members: MemberModel[]
  answers: AnswersModel[]
  teamKey: string
  onAddQuestion: (question: QuestionModel) => void
  onSaveQuestion: (question: QuestionModel) => void
}


const sortByDate = (a: QuestionModel, b: QuestionModel) => moment(b.date).diff(moment(a.date))

const Questions: React.FC<Props> = ({ questions, teamKey, members, answers, onAddQuestion, onSaveQuestion }) => (
  <Container>
    <Segment>
      <AddQuestionModal
        teamKey={teamKey}
        onAdd={onAddQuestion}
        members={members}
      />
      <Item.Group divided={true}>
        {questions
          .sort(sortByDate)
          .map((question, index) =>
            (<QuestionComponent
              question={question}
              answers={getQuestionAnswers(question.key, answers).answers}
              members={members}
              key={index}
              onSaveQuestion={onSaveQuestion} />)
          )}
      </Item.Group>
    </Segment>
  </Container>
)

export default Questions
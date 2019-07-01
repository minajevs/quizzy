import * as React from 'react'
import AnswerModel from 'models/answer'
import QuestionModel from 'models/question'
import MemberModel from 'models/member'
import UserModel from 'models/user'
import AnswerComponent from 'components/Answer'
import ViewQuestion from 'components/ViewQuestion'

import * as ReactMarkdown from 'react-markdown'

import { Segment, Container, List, Sticky, Divider } from 'semantic-ui-react'

type Props = {
  answers: AnswerModel[]
  members: MemberModel[]
  user: UserModel
  question: QuestionModel
  onAddAnswer: (answer: AnswerModel) => void
}

const Answers: React.FC<Props> = props => {
  const { answers, onAddAnswer, question, members, user } = props

  const questionAuthorMember = React.useMemo(() => members.find(x => x.key === question.author), [members, question.author])
  const isQuestionAuthor = React.useMemo(() => (questionAuthorMember !== undefined && user.key === questionAuthorMember.user), [questionAuthorMember, user.key])

  const currentMember = React.useMemo(() => members.find(x => x.user === user.key), [members, user.key])

  console.log('members', members)
  console.log('user', user)
  console.log('currentmember', currentMember)

  const mapAnswers = React.useMemo(() => answers
    .filter(x => isQuestionAuthor || (currentMember !== undefined && x.author === currentMember.key))
    .map(answer =>
      answer.author === question.author
        ? null
        : <AnswerComponent
          type={question.unitsMeasure}
          answer={answer}
          members={members}
          units={question.units}
          key={answer.key}
          onAdd={onAddAnswer}
          answersClosed={question.answer !== null}
        />), [answers, onAddAnswer, question, members, isQuestionAuthor, currentMember])

  return (
    <Container>
      <Segment>
        <Container>
          <ViewQuestion question={question} />
        </Container>
        <List divided={true} selection={true} verticalAlign='middle'>
          {mapAnswers}
        </List>
      </Segment>
    </Container>
  )
}

export default Answers
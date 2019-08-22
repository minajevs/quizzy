import * as React from 'react'
import AnswerModel from 'models/answer'
import AnswersModel from 'models/answers'
import QuestionModel from 'models/question'
import MemberModel from 'models/member'
import UserModel from 'models/user'
import AnswerComponent from 'components/Answer'
import ViewQuestion from 'components/ViewQuestion'
import ResultsComponent from 'components/Results'

import { Segment, Container, List, Sticky, Divider } from 'semantic-ui-react'

import { context as appContext } from 'context/app'
import { context as membersContext } from 'context/members'
import { context as usersContext } from 'context/users'
import { context as questionsContext } from 'context/questions'
import { context as answersContext } from 'context/answers'
import Loading from 'components/Loading'
import getResults from 'api/results'

const AnswersContainer: React.FC = props => {
  const appStore = React.useContext(appContext)
  const membersStore = React.useContext(membersContext)
  const usersStore = React.useContext(usersContext)
  const questionsStore = React.useContext(questionsContext)
  const answersStore = React.useContext(answersContext)

  const { members } = membersStore
  const { currentUser } = usersStore

  const currentMember = appStore.currentMember()

  if (currentUser === null || currentMember === null) return (<> Unauthorized </>)

  const { latestQuestion } = questionsStore

  if (latestQuestion === null)
    return (
      <Container>
        <Segment>
          No questions yet
        </Segment>
      </Container>
    )

  const answers = answersStore.getAnswers(latestQuestion.key)

  if (currentUser === null)
    return Loading('user')

  if (members === null)
    return Loading('members')

  return <Answers
    members={members}
    latestQuestion={latestQuestion}
    answers={answers}
    currentUser={currentUser}
    currentMember={currentMember}
  />
}

const Answers: React.FC<{
  members: MemberModel[],
  latestQuestion: QuestionModel,
  currentUser: UserModel,
  answers: AnswersModel | null,
  currentMember: MemberModel | undefined
}> = ({ members, latestQuestion, currentUser, answers, currentMember }) => {
  const questionAuthorMember = React.useMemo(() => members.find(x => x.key === latestQuestion.author), [members, latestQuestion.author])
  const isQuestionAuthor = React.useMemo(() => (questionAuthorMember !== undefined && currentUser.key === questionAuthorMember.user), [questionAuthorMember, currentUser])
  const mapAnswers = React.useMemo(() => answers && answers.answers
    .filter(x => isQuestionAuthor || (currentMember !== undefined && x.author === currentMember.key))
    .map((answer, index) =>
      answer.author === latestQuestion.author
        ? null
        : <AnswerComponent
          type={latestQuestion.unitsMeasure}
          answer={answer}
          units={latestQuestion.units}
          key={index}
          answersClosed={latestQuestion.answer !== null && latestQuestion.answer !== undefined}
        />), [answers, latestQuestion, members, isQuestionAuthor, currentMember])

  if (answers !== null && latestQuestion.answer !== null && latestQuestion.answer !== undefined) {
    const results = getResults(latestQuestion, answers, members)
    return <ResultsComponent
      question={latestQuestion}
      results={results.filter(result => !result.isAuthor)}
    />
  }

  return (
    <Container>
      <Segment>
        <Container>
          <ViewQuestion question={latestQuestion} />
        </Container>
        <List divided={true} selection={true} verticalAlign='middle'>
          {mapAnswers}
        </List>
      </Segment>
    </Container>
  )
}

export default AnswersContainer
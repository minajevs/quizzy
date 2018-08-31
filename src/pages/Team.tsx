import * as React from 'react'
import Api from 'api'
import TeamContainer from 'containers/Team'
import MembersContainer from 'containers/Members'
import AnswersContainer from 'containers/Answers'
import QuestionContainer from 'containers/Questions'
import { RouteComponentProps, withRouter } from 'react-router'

import MemberModel from 'models/member'
import QuestionModel from 'models/question'
import AnswerModel from 'models/answer'

type Props = {} & RouteComponentProps<{}>

type State = {
  members?: MemberModel[]
  questions?: QuestionModel[]
  answers?: AnswerModel[]
  latestQuestion?: QuestionModel
}

class Team extends React.Component<Props, State> {
  state: State = {}

  private api: Api = Api.getInstance()

  componentDidMount = () => {
    setInterval(() => {this.heartbeat()}, 5000)
  }

  public render() {
    const { match } = this.props
    const { members, questions, answers, latestQuestion } = this.state
    const teamKey = match.params['key']

    return (
      <TeamContainer teamKey={teamKey} getTeam={this.api.getTeam}>
        <AnswersContainer
          answers={answers}
          members={members}
          latestQuestion={latestQuestion}
          getLatestQuestion={this.getLatestQuestion}
          getAnswers={this.getAnswers}
          addAnswer={this.api.saveAnswer}
        />
        <QuestionContainer
          teamKey={teamKey}
          members={members}
          questions={questions}
          getMembers={this.getMembers}
          getQuestions={this.getQuestions}
          addQuestion={this.addQuestion}
          saveQuestion={this.saveQuestion}
        />
        <MembersContainer 
          teamKey={teamKey} 
          members={members}
          getMembers={this.getMembers}
          addMember={this.api.createMember}
          saveMember={this.api.saveMember}
        />
      </TeamContainer>
    )
  }

  heartbeat = () => {
    this.getMembers()
    this.getQuestions()
    this.getLatestQuestion()
    this.getAnswers()
  }

  addQuestion = async (question: QuestionModel) => {
    await this.api.createQuestion(question)
    this.getMembers()
    this.getQuestions()
    this.getLatestQuestion()
  }

  saveQuestion = async (question: QuestionModel) => {
    await this.api.saveQuestion(question)
    this.getMembers()
    this.getQuestions()
    this.getLatestQuestion()
  }

  getLatestQuestion = async () => {
    const question = await this.api.getLatestQuestion(this.props.match.params['key'])
    this.setState({latestQuestion: question})
  }

  getMembers = async () => {
    const members = await this.api.getMembersOfTeam(this.props.match.params['key'])
    this.setState({members})
  }

  getQuestions = async () => {
    const questions = await this.api.getQuestionOfTeam(this.props.match.params['key'])
    this.setState({questions})
  }

  getAnswers = async () => {
    const answers = this.state.latestQuestion !== undefined
    ? await this.api.getAnswersOfTeam(this.props.match.params['key'], this.state.latestQuestion.key)
    : []

    this.setState({answers})
  }

}

export default withRouter(Team)
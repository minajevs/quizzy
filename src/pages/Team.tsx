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
  loading: boolean
  members?: MemberModel[]
  questions?: QuestionModel[]
  answers?: AnswerModel[]
  latestQuestion?: QuestionModel
}

class Team extends React.Component<Props, State> {
  state: State = {loading: false}

  private api: Api = Api.getInstance()

  componentDidMount = () => {
    this.heartbeat()
    setInterval(() => {this.heartbeat()}, 5000)
  }

  public render() {
    const { match } = this.props
    const { members, questions, answers, latestQuestion, loading } = this.state
    const teamKey = match.params['key']

    return (
      <TeamContainer loading={loading} teamKey={teamKey} getTeam={this.api.getTeam} onAddTeam={this.createTeam}>
        <AnswersContainer
          answers={answers}
          members={members}
          latestQuestion={latestQuestion}
          addAnswer={this.api.saveAnswer}
        />
        <QuestionContainer
          teamKey={teamKey}
          answers={answers}
          members={members}
          questions={questions}
          addQuestion={this.addQuestion}
          saveQuestion={this.saveQuestion}
        />
        <MembersContainer 
          teamKey={teamKey} 
          members={members}
          addMember={this.addMember}
          saveMember={this.saveMember}
        />
      </TeamContainer>
    )
  }

  heartbeat = async () => {
    await Promise.all([
      this.getMembers(),
      this.getQuestions(),
      this.getLatestQuestion().then(() => 
        this.getAnswers())
    ])
  }

  createTeam = async (teamKey: string, teamName: string) => {
    await this.api.createTeam({
      key: teamKey,
      name: teamName
    })
    
    this.props.history.push(`/`, null)
    this.props.history.push(`${teamKey}`, null)
  }

  addMember = async (member: MemberModel) => {
    this.setLoading()
    await this.api.createMember(member)
    await this.heartbeat()
    this.unsetLoading()
  } 

  saveMember = async (member: MemberModel) => {
    this.setLoading()
    await this.api.saveMember(member)
    await this.heartbeat()
    this.unsetLoading()
  } 

  addQuestion = async (question: QuestionModel) => {
    this.setLoading()
    await this.api.createQuestion(question)
    await this.heartbeat()
    this.unsetLoading()
  }

  saveQuestion = async (question: QuestionModel) => {
    this.setLoading()
    await this.api.saveQuestion(question)
    await this.heartbeat()
    this.unsetLoading()
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

  setLoading = () => this.setState({loading: true})
  unsetLoading = () => this.setState({loading: false})
}

export default withRouter(Team)
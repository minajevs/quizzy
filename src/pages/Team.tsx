import * as React from 'react'
import Api from 'api'
import { getLatestQuestion, getQuestionAnswers } from 'api/helpers'
import TeamContainer from 'containers/Team'
import MembersContainer from 'containers/Members'
import AnswersContainer from 'containers/Answers'
import QuestionContainer from 'containers/Questions'
import { RouteComponentProps, withRouter } from 'react-router'

import UserModel from 'models/user'
import TeamModel from 'models/team'
import MemberModel from 'models/member'
import QuestionModel from 'models/question'
import AnswersModel from 'models/answers'
import AnswerModel from 'models/answer'

type Props = {} & RouteComponentProps<{}>

type State = {
  loading: boolean
  team: TeamModel | null
  teamNotFound: boolean
  members: MemberModel[] | null
  users: UserModel[] | null
  user: UserModel | null
  questions: QuestionModel[] | null
  answers: AnswersModel[] | null
  latestQuestion: QuestionModel | null
  latestAnswers: AnswerModel[] | null
}

class Team extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      loading: false,
      team: null,
      teamNotFound: false,
      members: null,
      users: null,
      user: null,
      questions: null,
      answers: null,
      latestQuestion: null,
      latestAnswers: null,
    }
  }

  componentDidMount() {
    const teamKey = this.props.match.params['key']

    if (teamKey === null || teamKey === undefined || teamKey === '') {
      this.props.history.push(`/`)
      return
    }

    if (!this.api.loggedIn()) {
      this.props.history.push(`/l/${teamKey}`)
      return
    }

    this.loadData()
  }

  private api: Api = Api.getInstance()


  loadData = async () => {
    this.setState({ user: this.api.currentUser() })
    this.api.subscribe<UserModel>('user', user => this.setState({ user }))

    this.api.subscribe<TeamModel>('team', team => this.setState({ team, teamNotFound: team === null }))
    this.api.subscribe<MemberModel[]>('members', members => this.setState({ members }))
    this.api.subscribe<UserModel[]>('users', this.handleUsersChange)
    this.api.subscribe<QuestionModel[]>('questions', questions => this.setState({ questions, latestQuestion: getLatestQuestion(questions) }))
    this.api.subscribe<AnswersModel[]>('answers', answers => this.setState({ answers }))

    this.api.loadFor(this.props.match.params['key'])
  }

  handleUsersChange = (users: UserModel[]) => {
    this.setState({ users })

    if (this.state.teamNotFound)
      return

    // check if first time login
    const currentUser = this.api.currentUser()
    if (currentUser === null || this.state.members === null) {
      return
    }

    if (users.find(x => x.key === currentUser.key) === undefined) {
      return
    }

    const userMember = this.state.members.find(x => x.inviteEmail === currentUser.email)
    if (userMember === undefined) {
      // user is not invited to this team!
      this.props.history.push('/np')
      return
    }

    this.api.saveMember({ ...userMember, user: currentUser.key })
  }

  public render() {
    const { match } = this.props
    const { loading, team, teamNotFound, answers, members, users, questions, latestQuestion, user } = this.state
    const teamKey = match.params['key']

    return (
      <TeamContainer team={team} teamNotFound={teamNotFound} loading={loading} teamKey={teamKey} onAddTeam={this.createTeam}>
        <AnswersContainer
          answers={answers}
          members={members}
          user={user}
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
          isAdmin={false}
          users={users}
          addMember={this.addMember}
          saveMember={this.saveMember}
        />
      </TeamContainer>
    )
  }

  createTeam = async (teamKey: string, teamName: string) => {
    await this.api.createTeam({
      key: teamKey,
      name: teamName
    })

    this.props.history.push(`/`)
    this.props.history.push(`t/${teamKey}`)
  }

  addMember = async (member: MemberModel) => {
    this.setLoading()
    await this.api.createMember(member)
    this.unsetLoading()
  }

  saveMember = async (member: MemberModel) => {
    this.setLoading()
    await this.api.saveMember(member)
    this.unsetLoading()
  }

  addQuestion = async (question: QuestionModel) => {
    this.setLoading()
    await this.api.createQuestion(question)
    this.unsetLoading()
  }

  saveQuestion = async (question: QuestionModel) => {
    this.setLoading()
    await this.api.saveQuestion(question)
    this.unsetLoading()
  }

  setLoading = () => this.setState({ loading: true })
  unsetLoading = () => this.setState({ loading: false })
}

export default withRouter(Team)
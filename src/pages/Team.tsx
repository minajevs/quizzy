import * as React from 'react'
import Api from 'api'
import { getLatestQuestion, getQuestionAnswers } from 'api/helpers'
import TeamContainer from 'containers/Team'
import MembersContainer from 'containers/Members'
import AnswersContainer from 'containers/Answers'
import QuestionContainer from 'containers/Questions'
import { RouteComponentProps, withRouter } from 'react-router'

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
      questions: null,
      answers: null,
      latestQuestion: null,
      latestAnswers: null
    }
    this.loadData()
  }

  private api: Api = Api.getInstance()

  loadData = async () => {
    this.api.subscribe<TeamModel>('team', team => this.setState({ team, teamNotFound: team === null }))
    this.api.subscribe<MemberModel[]>('members', members => this.setState({ members }))
    this.api.subscribe<QuestionModel[]>('questions', questions => this.setState({ questions, latestQuestion: getLatestQuestion(questions) }))
    this.api.subscribe<AnswersModel[]>('answers', answers => this.setState({ answers }))

    this.api.loadFor(this.props.match.params['key'])
  }

  public render() {
    const { match } = this.props
    const { loading, team, teamNotFound, answers, members, questions, latestQuestion } = this.state
    const teamKey = match.params['key']

    return (
      <TeamContainer team={team} teamNotFound={teamNotFound} loading={loading} teamKey={teamKey} onAddTeam={this.createTeam}>
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
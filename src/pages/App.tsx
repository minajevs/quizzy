import * as React from 'react'
import Api from 'api'
import Team from 'models/team'
import UserModel from 'models/user'
import { RouteComponentProps, withRouter } from 'react-router'
import { Grid, Container, Button, Icon, Modal, Input, Label, Dropdown, DropdownItemProps, DropdownProps, Segment, Header } from 'semantic-ui-react'
import CreateNewTeam from 'components/CreateNewTeam';
import Validation from 'components/Validation';

type State = {
  teamId: string
  validate: boolean,
  user: UserModel | null
}

type Props = {} & RouteComponentProps<{}>

class App extends React.Component<Props, State> {
  private api: Api
  constructor(props: Props) {
    super(props)

    this.api = Api.getInstance()
    this.state = { teamId: '', validate: false, user: this.api.currentUser() }

    this.api.subscribe<UserModel>('user', user => {
      this.setState({ user })
    })
  }

  public render() {
    const { user } = this.state
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Container>
              <Segment style={{ marginTop: '3em', marginBottom: '1em' }}>
                <Header> Welcome! Enter yours team id: </Header>
                <Input
                  fluid
                  type="text"
                  label='Team id'
                  name="teamId"
                  placeholder='Team id'
                  onChange={this.handleChange}
                  onKeyPress={this.onKeyPress('Enter', this.join)}
                  action={{ color: 'teal', labelPosition: 'right', icon: 'angle double right', content: 'Join', onClick: this.join }}
                />
                <Validation value={this.state.teamId} error='Please enter an id!' rule={this.notEmpty} validate={this.state.validate} />
                {user === null
                  ? <>
                    <Header> Or log in to create a new team</Header>
                  </>
                  : <>
                    <Header> Or create a new team: </Header>
                    <CreateNewTeam onAddTeam={this.addTeam} />
                  </>}
              </Segment>
            </Container>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }

  notEmpty = (value: string) => value !== '' && value !== undefined

  addTeam = async (teamKey: string, teamName: string) => {
    await this.api.createTeam({
      key: teamKey,
      name: teamName
    })
    this.props.history.push(`t/${teamKey}`)
  }

  join = () => {
    if (!this.notEmpty(this.state.teamId))
      return this.setState({ validate: true })

    this.props.history.push(`t/${this.state.teamId}`)
  }

  private handleChange = <T extends keyof State>(event: React.ChangeEvent<HTMLInputElement>) => {
    const newState = {
      [event.target.name]: event.target.value,
      // keyNotInState: '42', -> would throw a compile time error
      // numericKeyInState: 'assigning wrong type' -> would throw a compile time error
    };
    this.setState(newState as { [P in T]: State[P]; });
  }

  private onKeyPress = (expectedKey: string, func: () => void) => (event: React.KeyboardEvent) => {
    if (event.key === expectedKey)
      func()
  }
}

export default withRouter(App)
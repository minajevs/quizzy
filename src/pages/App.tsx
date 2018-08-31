import * as React from 'react'
import Api from 'api'
import Team from 'models/team'
import { RouteComponentProps, withRouter } from 'react-router'
import { Grid, Container, Button, Icon, Modal, Input, Label, Dropdown, DropdownItemProps, DropdownProps, Segment, Header } from 'semantic-ui-react'

type State = {
  teamId: string
  newTeamId: string
  newTeamName: string
}

type Props = {} & RouteComponentProps<{}>

class App extends React.Component<Props, State> {
  private api: Api
  constructor(props: Props) {
    super(props)

    this.api = Api.getInstance()
    this.state = { newTeamId: '', newTeamName: '', teamId: '' }
  }

  public render() {
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
                <Header> Or create a new team: </Header>
                <Input
                  fluid
                  type="text"
                  name="newTeamId"
                  label='New team id'
                  placeholder='New team id'
                  onChange={this.handleChange}
                />
                <br />
                <Input
                  fluid
                  type="text"
                  name="newTeamName"
                  label='New team name'
                  placeholder='New team name'
                  onKeyPress={this.onKeyPress('Enter', this.addTeam)}
                  onChange={this.handleChange}
                />
                <br />
                <Button onClick={this.addTeam} color='teal' content='Create' labelPosition='right' icon='plus circle'/>
              </Segment>
            </Container>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }

  addTeam = async () => {
    await this.api.createTeam({
      key: this.state.newTeamId,
      name: this.state.newTeamName
    })
    this.props.history.push(`${this.state.newTeamId}`)
  }

  join = () => {
    console.log(this.state.teamId)
    this.props.history.push(`${this.state.teamId}`)
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
    if(event.key === expectedKey)
      func()
  }
}

export default withRouter(App)
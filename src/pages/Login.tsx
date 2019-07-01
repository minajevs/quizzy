// Import FirebaseAuth and firebase.
import * as React from 'react'
import * as firebaseui from 'firebaseui'
import { RouteComponentProps, withRouter } from 'react-router'

import Api from 'api'
import { Header, Grid, Loader } from 'semantic-ui-react'

class Login extends React.Component<RouteComponentProps<{}>> {
  private api: Api = Api.getInstance()

  componentDidMount(){
    const teamKey = this.props.match.params['key']
    
    let returnUrl = `#/t/${teamKey}`

    if(teamKey === null || teamKey === undefined || teamKey === ''){
      returnUrl = '#/'
    }

    this.api.subscribe('user', user => {
      if(this.api.loggedIn()) return this.props.history.push(returnUrl.replace('#', ''))
    })

    this.api.startFirebaseUi('#firebaseui', returnUrl)
  }

  render() {
    return (
      <Grid stackable>
        <Grid.Row>
          <Grid.Column>
            <Header textAlign='center' size='huge' content='Please, login!' style={{ marginTop: '3em', marginBottom: '1em' }} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns='3'>
          <Grid.Column />
          <Grid.Column>
            <div id='firebaseui'/>
          </Grid.Column>
          <Grid.Column />
        </Grid.Row>
      </Grid>
    );
  }
}

export default withRouter(Login)
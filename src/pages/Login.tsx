// Import FirebaseAuth and firebase.
import * as React from 'react'
import * as firebaseui from 'firebaseui'
import { RouteComponentProps, withRouter } from 'react-router'

import { AppApi, subscribe } from 'api'
import Core from 'api/core'
import { Header, Grid, Loader } from 'semantic-ui-react'

import { context as appContext } from 'context/app'
import { context as membersContext } from 'context/members'
import { context as usersContext } from 'context/users'
import { context as questionsContext } from 'context/questions'
import { context as answersContext } from 'context/answers'
import { useRouter } from 'HookedRouter'

const Login: React.FC = props => {
  const appStore = React.useContext(appContext)
  const membersStore = React.useContext(membersContext)
  const usersStore = React.useContext(usersContext)
  const questionsStore = React.useContext(questionsContext)
  const answersStore = React.useContext(answersContext)
  const router = useRouter()

  React.useEffect(() => {
    const { teamKey } = router

    const returnUrl = (teamKey === null || teamKey === undefined || teamKey === '')
      ? '#/'
      : `#/t/${teamKey}`

    subscribe('user', user => {
      if (AppApi.loggedIn()) return router.history.push(returnUrl.replace('#', ''))
    })
    Core.getInstance().startFirebaseUi('#firebaseui', returnUrl)
  }, [router])

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
          <div id='firebaseui' />
        </Grid.Column>
        <Grid.Column />
      </Grid.Row>
    </Grid>
  );
}

export default Login
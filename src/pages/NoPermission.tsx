// Import FirebaseAuth and firebase.
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'

import { Header, Grid } from 'semantic-ui-react'

class NoPermission extends React.Component<RouteComponentProps<{}>> {
  render() {
    return (
      <Grid stackable>
        <Grid.Row>
          <Grid.Column>
            <Header textAlign='center' size='huge' content='You are not invited to this team!' style={{ marginTop: '3em', marginBottom: '1em' }} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns='3'>
          <Grid.Column />
          <Grid.Column>
            <Header textAlign='center' size='medium' content='Contact owner to invite you' style={{ marginTop: '3em', marginBottom: '1em' }} />
          </Grid.Column>
          <Grid.Column />
        </Grid.Row>
      </Grid>
    );
  }
}

export default withRouter(NoPermission)
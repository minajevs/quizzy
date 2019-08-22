// Import FirebaseAuth and firebase.
import * as React from 'react'

import { Header, Grid } from 'semantic-ui-react'

const NoPermission: React.FC = props => (
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
)

export default NoPermission
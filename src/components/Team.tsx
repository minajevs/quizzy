import * as React from 'react'
import TeamModel from 'models/team'

import { Header, Grid, Loader } from 'semantic-ui-react'

type Props = {
  loading: boolean
  team: TeamModel
  children: React.ReactNode
}

const Team: React.FC<Props> = ({ team, children, loading }) => {
  const children1 = [] as React.ReactNode[]
  const children2 = [] as React.ReactNode[]

  React.Children.forEach(children, (child, index) => {
    index % 2 === 0
      ? children1.push(child)
      : children2.push(child)
  })
  return (
    <Grid stackable>
      <Grid.Row>
        <Grid.Column>
          <Header textAlign='center' size='huge' content={team.name} style={{ marginTop: '3em', marginBottom: '1em' }} />
          <Loader active={loading} size='small' />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={2}>
        <Grid.Column className='main-column-left'>
          {React.Children.map(children1, (child, index) => (
            <Grid.Row key={index}>
              {child}
              <br />
            </Grid.Row>
          ))}
        </Grid.Column>
        <Grid.Column className='main-column-right'>
          {React.Children.map(children2, (child, index) => (
            <Grid.Row key={index}>
              {child}
              <br />
            </Grid.Row>
          ))}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export default Team
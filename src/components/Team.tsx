import * as React from 'react'
import TeamModel from 'models/team'

import { Header, Grid, Loader } from 'semantic-ui-react'

type Props = {
  loading: boolean
  team: TeamModel
  children: React.ReactNode
}

class Team extends React.Component<Props> {
  public render() {
    const { team, children, loading } = this.props
    const children1 = [] as React.ReactChild[]
    const children2 = [] as React.ReactChild[]
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
            <Loader active={loading} size='small'/>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Column className='main-column'>
            {React.Children.map(children1, (child, index) => (
              <Grid.Row key={index}>
                {child}
                <br />
              </Grid.Row>
            ))}
          </Grid.Column>
          <Grid.Column className='main-column'>
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
}

export default Team
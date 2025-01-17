import * as React from 'react'
import TeamModel from 'models/team'

import { Header, Grid, Loader } from 'semantic-ui-react'
import Loading from 'components/Loading'
import TeamNotFound from 'components/TeamNotFound'

import MembersComponent from 'components/Members'
import AnswersComponent from 'components/Answers'
import QuestionsComponent from 'components/Questions'

import { useRouter } from 'HookedRouter'

import { context as membersContext } from 'context/members'
import { context as teamContext } from 'context/team'
import { context as questionsContext } from 'context/questions'
import { context as answersContext } from 'context/answers'
import { context as appContext } from 'context/app'

const Team: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const teamStore = React.useContext(teamContext)

  const { team } = teamStore

  if (team === null) return Loading('team')

  return (
    <Grid stackable>
      <Grid.Row>
        <Grid.Column>
          <Header textAlign='center' size='huge' content={team!.name} style={{ marginTop: '3em', marginBottom: '1em' }} />
          <Loader active={teamStore.loading} size='small' />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={2}>
        <Grid.Column className='main-column-left'>
          <Grid.Row>
            <AnswersComponent />
            <br />
          </Grid.Row>
          <Grid.Row>
            <MembersComponent />
            <br />
          </Grid.Row>
        </Grid.Column>
        <Grid.Column className='main-column-right'>
          <Grid.Row>
            <QuestionsComponent />
            <br />
          </Grid.Row>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export default Team
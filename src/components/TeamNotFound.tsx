import * as React from 'react'
import { Container, Segment, Header } from 'semantic-ui-react'
import CreateNewTeam from 'components/CreateNewTeam'

const TeamNotFound = (teamKey: string) => (
    <Container>
        <Segment style={{ marginTop: '3em', marginBottom: '1em' }}>
            <Header color='red'>
                Team with key '{teamKey}' was not found! Do you want to create it?
            </Header>
            <CreateNewTeam teamKey={teamKey} />
        </Segment>
    </Container>
)

export default TeamNotFound
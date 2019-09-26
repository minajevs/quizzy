import * as React from 'react'

import { context as appContext } from 'context/app'
import { context as usersContext } from 'context/users'
import { useRouter } from 'HookedRouter'

import { Grid, Container, Button, Icon, Modal, Input, Label, Dropdown, DropdownItemProps, DropdownProps, Segment, Header } from 'semantic-ui-react'
import CreateNewTeam from 'components/CreateNewTeam';
import Validation from 'components/Validation';

const App: React.FC = props => {
    const store = React.useContext(appContext)
    const usersStore = React.useContext(usersContext)
    const [teamId, setTeamId] = React.useState('')
    const router = useRouter()

    const notEmpty = React.useCallback((value: string) => (value !== '' && value !== undefined), [])

    const join = React.useCallback((teamKey: string) => {
        if (!notEmpty(teamKey))
            return store.validate()

        router.history.push(`t/${teamKey}`)
    }, [router.history])

    const handleChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist()
        setTeamId(event.target.value);
    }, [])

    const onKeyPress = React.useCallback((expectedKey: string, func: () => void) => (event: React.KeyboardEvent) => {
        if (event.key === expectedKey)
            func()
    }, [])

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
                                onChange={handleChange}
                                onKeyPress={onKeyPress('Enter', () => join(teamId))}
                                action={{ color: 'teal', labelPosition: 'right', icon: 'angle double right', content: 'Join', onClick: () => join(teamId), "data-test": 'join' }}
                                data-test='join-team-id'
                            />
                            <Validation value={teamId} error='Please enter an id!' rule={notEmpty} validate={store.shouldValidate} />
                            {usersStore.currentUser === null
                                ? <>
                                    <Header> Or log in to create a new team</Header>
                                </>
                                : <>
                                    <Header> Or create a new team: </Header>
                                    <CreateNewTeam />
                                </>}
                        </Segment>
                    </Container>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

export default App
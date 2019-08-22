import * as React from 'react'

import UserModel from 'models/user'

import { Grid, Container, Button, Header } from 'semantic-ui-react'

import { useRouter } from 'HookedRouter'
import { context as appContext } from 'context/app'
import { context as usersContext } from 'context/users'

const PageHeader: React.FC = props => {
    const appStore = React.useContext(appContext)
    const usersStore = React.useContext(usersContext)
    const router = useRouter()

    const requestLogIn = React.useCallback(() => router.history.push('/l'), [router])

    const getHeader = React.useCallback(() => (usersStore.currentUser === null
        ? <>
            Not logged in
            <Button basic style={{ margin: '0 1em' }} onClick={requestLogIn}>Login</Button>
        </>
        : <>
            Logged in as {usersStore.currentUser.name}
            <Button basic style={{ margin: '0 1em' }} onClick={appStore.logOut}>Logout</Button>
        </>), [usersStore.currentUser])

    return (
        <Grid>
            <Grid.Row>
                <Container>
                    <Header floated="right" dividing>
                        {getHeader()}
                    </Header>
                </Container>
            </Grid.Row>
        </Grid>
    )
}

export default PageHeader
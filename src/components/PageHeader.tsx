import * as React from 'react'
import Api from 'api'

import UserModel from 'models/user'
import { RouteComponentProps, withRouter } from 'react-router'

import { Grid, Container, Button, Header } from 'semantic-ui-react'

type Props = RouteComponentProps<{}>

type State = {
    user: UserModel | null
}

// TODO: separate container
class PageHeader extends React.Component<Props, State> {
    private api: Api
    constructor(props: RouteComponentProps<{}>) {
        super(props)

        this.api = Api.getInstance()
        this.state = { user: null }

        this.api.subscribe<UserModel>('user', user => {
            this.setState({ user })
        })
    }

    public render() {
        const { user } = this.state
        return (
            <Grid>
                <Grid.Row>
                    <Container>
                        <Header floated="right" dividing>
                            {this.getHeader()}
                        </Header>
                    </Container>
                </Grid.Row>
            </Grid>
        )
    }

    getHeader = () => this.state.user === null
        ? <>
            Not logged in
            <Button basic style={{ margin: '0 1em' }} onClick={this.logIn}>Login</Button>
        </>
        : <>
            Logged in as {this.state.user.name}
            <Button basic style={{ margin: '0 1em' }} onClick={this.logOut}>Logout</Button>
        </>

    logOut = () => this.api.logOut()
    logIn = () => this.props.history.push('/l')
}

export default withRouter(PageHeader)
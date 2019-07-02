import * as React from 'react'
import Api from 'api'

import UserModel from 'models/user'
import { RouteComponentProps, withRouter } from 'react-router'

type Props = RouteComponentProps<{}>

type State = {
    user: UserModel | null
}


class Auth extends React.Component<Props, State> {
    private api: Api
    constructor(props: RouteComponentProps<{}>) {
        super(props)

        this.api = Api.getInstance()
        this.state = { user: null }

        this.api.subscribe<UserModel | null>('user', user => {
            if(this.state.user !== null && user === null){
                // signing out
                this.props.history.push('/')
            }
            this.setState({ user })
        })
    }

    public render() {
        return this.props.children
    }
}

export default withRouter(Auth)
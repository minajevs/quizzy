import * as React from 'react'
import {
    HashRouter as Router,
    Route,
    Link
} from 'react-router-dom'

import App from 'pages/App'
import Team from 'pages/Team'
import Login from 'pages/Login'
import NoPermission from 'pages/NoPermission'

import Auth from 'containers/Auth'
import PageHeader from 'components/PageHeader'

const Main = () => (
    <>
        <Router>
            <Auth>
                <PageHeader />
                <Route exact={true} path='/' component={App} />
                <Route path='/t/:key' component={Team} />
                <Route exact path='/l' component={Login} />
                <Route path='/l/:key' component={Login} />
                <Route exact path='/np' component={NoPermission} />
            </Auth>
        </Router>
    </>
)

export default Main
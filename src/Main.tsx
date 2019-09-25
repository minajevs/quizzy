import * as React from 'react'
import { HookedBrowserRouter } from 'HookedRouter'

import { Route } from 'react-router-dom'
import { Switch } from 'react-router'
import withMatchParam from 'withMatchParam'

import App from 'pages/App'
import Team from 'pages/Team'
import Login from 'pages/Login'
import NoPermission from 'pages/NoPermission'

import Auth from 'containers/Auth'
import PageHeader from 'components/PageHeader'
import CombineProviders from 'CombineProviders'

import { Provider as AppProvider } from 'context/app'
import { Provider as TeamProvider } from 'context/team'
import { Provider as QuestionsProvider } from 'context/questions'
import { Provider as MembersProvider } from 'context/members'
import { Provider as AnswersProvider } from 'context/answers'
import { Provider as UsersProvider } from 'context/users'

const Main = () => (
    <>
        <HookedBrowserRouter>
            <CombineProviders providers={[UsersProvider, TeamProvider, MembersProvider, QuestionsProvider, AnswersProvider, AppProvider]}>
                <Auth>
                    <PageHeader />
                    <Route exact={true} path='/' component={App} />
                    <Route exact={true} path='/l' component={Login} />
                    <Route path='/l/:key' component={Login} />
                    <Route exact={true} path='/np' component={NoPermission} />

                    <Route path='/t/:key' component={Team} />
                </Auth>
            </CombineProviders>
        </HookedBrowserRouter>
    </>
)

export default Main
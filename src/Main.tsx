import * as React from 'react'
import { HashRouter as Router,
    Route,
    Link
} from 'react-router-dom'

import App from 'pages/App'
import Team from 'pages/Team'

const Main = () => (
    <Router>
        <>
            <Route exact={true} path='/' component={App} />
            <Route path='/:key' component={Team} />
        </>
    </Router>
)

export default Main
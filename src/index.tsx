import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Main from 'Main'
import registerServiceWorker from './registerServiceWorker'
import 'semantic-ui-css/semantic.min.css'
import 'styles.css'

ReactDOM.render(
  <Main />,
  document.getElementById('root') as HTMLElement
)

registerServiceWorker()
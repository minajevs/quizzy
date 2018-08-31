import * as React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'

const Loading = (name: string = '...') => (
    <Dimmer active={true}>
        <Loader size='big'>Loading {name}</Loader>
    </Dimmer>
)

export default Loading
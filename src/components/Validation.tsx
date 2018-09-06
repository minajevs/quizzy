import * as React from 'react'
import { Message } from 'semantic-ui-react'

type Props = {
    value: string
    error: string
    rule: (value:string) => boolean
    validate?: boolean
}

class Validation extends React.Component<Props> {
    render() {
        const { error, value, rule, validate } = this.props
        const shouldValidate = validate === undefined ? true : validate
        return (
            <Message hidden={!shouldValidate || rule(value)} attached='bottom' content={error} error/>
        )
    }
}

export default Validation


import * as React from 'react'
import { Message } from 'semantic-ui-react'

type Props = {
    value: string
    error: string
    rule: (value: string) => boolean
    validate?: boolean
}

const Validation: React.FC<Props> = ({ error, value, rule, validate }) => {
    const shouldValidate = validate === undefined ? true : validate
    return (
        <Message hidden={!shouldValidate || rule(value)} attached='bottom' content={error} error data-test="validation-error" />
    )
}

export default Validation


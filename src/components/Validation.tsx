import * as React from 'react'
import { Message } from 'semantic-ui-react'

type Props = {
    value: string
    error: string
    rule: (value:string) => boolean
    validate?: boolean
}

type State = {
    touched: boolean
}

class Validation extends React.Component<Props, State> {
    state: State = { touched: false }
    render() {
        const { error, value, rule, validate } = this.props
        const { touched } = this.state
        const shouldValidate = validate === undefined ? true : validate
        return (
            <Message hidden={!shouldValidate || !touched || rule(value)} attached='bottom' content={error} error/>
        )
    }

    componentDidUpdate(prevProps: Props){
        if(!this.state.touched && (prevProps.value !== this.props.value || prevProps.validate !== this.props.validate))
            this.setState({touched: true})
    }
}

export default Validation


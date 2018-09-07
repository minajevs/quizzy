import * as React from 'react'

import { UnitsMeasure } from 'models/question'

import AnswerInputModal from 'components/AnswerInputModal'

import * as moment from 'moment'

import * as DateTime from 'react-datetime'

import { Input, Form, Icon, SemanticICONS, Label } from 'semantic-ui-react'

type Props = {
    type: UnitsMeasure
    label?: React.ReactNode
    button?: React.ReactNode
    children?: React.ReactNode
    onChange: (value: number) => void
    onKeyPress: (event: React.KeyboardEvent<Element>) => void
}

class AnswerInput extends React.Component<Props> {
    render() {
        const { type, onChange, onKeyPress, label, button, children } = this.props
        if (type === 'free')
            return <Input
                onChange={this.handleChange}
                onKeyPress={onKeyPress}
                type='number'
                labelPosition='right'
                fluid
            >
                {label}
                <input />
                {children}
                {button}
            </Input>
        else
            return <AnswerInputModal
                onChange={onChange}
                type={type}
                label={label}
                children={children}
                button={button}
            />
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onChange(parseInt(event.target.value, 10))
    }
}

export default AnswerInput
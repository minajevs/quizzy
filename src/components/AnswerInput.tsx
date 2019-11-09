import * as React from 'react'

import { UnitsMeasure } from 'models/question'

import { Input, Form, Icon, SemanticICONS, Label } from 'semantic-ui-react'

type Props = {
    type: UnitsMeasure
    label?: React.ReactNode
    button?: React.ReactNode
    children?: React.ReactNode
    defaultValue?: number
    onChange: (value: number) => void
    onKeyPress: (event: React.KeyboardEvent<Element>) => void
}

const AnswerInput: React.FC<Props> = props => {
    const { type, onChange, onKeyPress, label, button, children, defaultValue } = props

    const handleChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist()
        props.onChange(parseFloat(event.target.value))
    }, [props.onChange])

    if (type === 'free')
        return <Input
            onChange={handleChange}
            onKeyPress={onKeyPress}
            defaultValue={defaultValue}
            type='number'
            step='0.001'
            labelPosition='right'
            fluid
            data-test="answer-input"
        >
            {label}
            <input />
            {children}
            {button}
        </Input>
    else
        return <Input
            onChange={handleChange}
            onKeyPress={onKeyPress}
            defaultValue={defaultValue}
            type='text'
            labelPosit
            data-test="answer-input"
        >
            {label}
            <input />
            {children}
            {button}
        </Input>
}

export default AnswerInput
import * as React from 'react'

import { UnitsMeasure } from 'models/question'

import * as moment from 'moment'

import * as DateTime from 'react-datetime'

import { Input, Form, Icon, SemanticICONS, Label } from 'semantic-ui-react'

type Props = {
    type: UnitsMeasure
    label: React.ReactNode
    button: React.ReactNode
    children: React.ReactNode
    onChange: (value: string) => void
    onKeyPress: (event: React.KeyboardEvent<Element>) => void
}

type State = {
    hours: string,
    minutes: string,
    seconds: string,
    ms: string
}

class AnswerInput extends React.Component<Props, State> {
    state: State = {
        hours: '00',
        minutes: '00',
        seconds: '00',
        ms: '00'
    }
    render() {
        const { hours, minutes, seconds, ms } = this.state
        const { type, onChange, onKeyPress, label, button, children } = this.props
        switch (type) {
            case 'free':
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

            case 'time':
                return <>
                    <Form.Input>
                        {label}
                        {this.inputFor('hours')}
                        {this.inputFor('minutes')}
                        {this.inputFor('seconds')}
                        {this.inputFor('ms')}
                        {button}
                    </Form.Input>
                </>
            case 'date':
                return <Label icon='calendar' size='large' content='date' className='middle-label' />
            case "datetime":
                return <Label icon='calendar check' size='large' content='date and time' className='middle-label' />
            default:
                return 'no input for dat'
        }
    }

    inputFor = (field: keyof State) =>
        <Input
            type='number'
            defaultValue='00'
            labelPosition='right'
            label={{ basic: true, content: field }}
            onChange={this.handleTimeChange(field)}
        />

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onChange(event.target.value)
    }

    handleTimeChange = (field: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const newState = { ...this.state, [field]: event.target.value }
        this.setState(newState)

        const { hours, minutes, seconds, ms } = newState

        const stamp = moment(`${hours}:${minutes}:${seconds}:${ms}`).valueOf()
        this.props.onChange(stamp.toString())
    }

    renderInput = (ref: any, props: any) => (
        <Input
            labelPosition='right'
            fluid
        >
            {this.props.label}
            <input ref={ref} {...props} />
            {this.props.children}
            {this.props.button}
        </Input>
    )
}

export default AnswerInput
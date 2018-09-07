import * as React from 'react'

import * as moment from 'moment'

import { Button, Icon, Modal, Input, Form } from 'semantic-ui-react'
import { UnitsMeasure } from 'models/question'

type Props = {
    type: UnitsMeasure
    label: React.ReactNode
    children: React.ReactNode
    button: React.ReactNode
    onChange: (value: number) => void
}

type State = {
    open: boolean
    DD?: string
    MM?: string
    YYYY?: string
    hh?: string
    mm?: string
    ss?: string
    ms?: string
}

class AnswerInputModal extends React.Component<Props, State>{
    state: State = {
        open: false
    }
    render() {
        const { open, hh, mm, ss, ms } = this.state
        const { label, children, button } = this.props
        return (
            <>
                <Input onFocus={this.open} value={this.formatedValue()} fluid>
                    {label}
                    <input />
                    {children}
                    {button}
                </Input>
                <Modal open={open}>
                    <Modal.Header>Add answer</Modal.Header>
                    <Modal.Content>
                        {this.form()}
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.cancel}>Cancel</Button>
                        <Button positive onClick={this.close}>Ok</Button>
                    </Modal.Actions>
                </Modal>
            </>
        )
    }

    private form = () => {
        const { open, hh, mm, ss, ms, DD, MM, YYYY } = this.state
        const { label, children, button, type } = this.props
        switch (type) {
            case 'time':
                return (
                    <>
                        <Form>
                            <Form.Group>
                                <Form.Input label='Hours' width='4' type='number' onChange={this.numberChange('hh', 0, 24)} value={hh} />
                                <Form.Input label='Minutes' width='4' type='number' onChange={this.numberChange('mm', 0, 59)} value={mm} />
                                <Form.Input label='Seconds' width='4' type='number' onChange={this.numberChange('ss', 0, 59)} value={ss} />
                                <Form.Input label='Milliseconds' width='4' type='number' onChange={this.numberChange('ms', 0, 999, '000')} value={ms} />
                            </Form.Group>
                        </Form>
                    </>
                )
            case 'date':
                return (
                    <>
                        <Form>
                            <Form.Group>
                                <Form.Input label='Day' width='5' type='number' onChange={this.numberChange('DD', 1, 31)} value={DD} />
                                <Form.Input label='Month' width='5' type='number' onChange={this.numberChange('MM', 1, 12)} value={MM} />
                                <Form.Input label='Year' width='5' type='number' onChange={this.numberChange('YYYY', 0, 9999, '0000')} value={YYYY} />
                            </Form.Group>
                        </Form>
                    </>
                )
            case 'datetime':
                return (
                    <>
                        <Form>
                            <Form.Group>
                                <Form.Input label='Day' width='4' type='number' onChange={this.numberChange('DD', 1, 31)} value={DD} />
                                <Form.Input label='Month' width='4' type='number' onChange={this.numberChange('MM', 1, 12)} value={MM} />
                                <Form.Input label='Year' width='4' type='number' onChange={this.numberChange('YYYY', 0, 9999, '0000')} value={YYYY} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Input label='Hours' width='4' type='number' onChange={this.numberChange('hh', 0, 24)} value={hh} />
                                <Form.Input label='Minutes' width='4' type='number' onChange={this.numberChange('mm', 0, 59)} value={mm} />
                                <Form.Input label='Seconds' width='4' type='number' onChange={this.numberChange('ss', 0, 59)} value={ss} />
                                <Form.Input label='Milliseconds' width='4' type='number' onChange={this.numberChange('ms', 0, 999, '000')} value={ms} />
                            </Form.Group>
                        </Form>
                    </>
                )

            default: return ''
        }
    }

    private numberChange = (key: keyof State, min: number, max: number, mask: string = '00') => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        const num = parseInt(event.target.value, 10)

        if (value === '') {
            const state1 = { ...this.state, [key]: mask }
            this.setState(state1)
            this.onChange(state1)
        }

        if (num < min || num > max)
            return

        const state2 = { ...this.state, [key]: (mask + value).substring(value.length) }
        this.setState(state2)
        this.onChange(state2)
    }

    private open = () => {
        switch (this.props.type) {
            case 'time':
                this.setState({ open: true, hh: '00', mm: '00', ss: '00', ms: '000' })
                break
            case 'date':
                this.setState({ open: true, DD: '01', MM: '01', YYYY: '2018' })
                break
            case 'datetime':
                this.setState({ open: true, hh: '00', mm: '00', ss: '00', ms: '000', DD: '01', MM: '01', YYYY: '2018' })
                break
        }
    }

    private cancel = () => {
        this.setState({ open: false, hh: undefined, mm: undefined, ss: undefined, ms: undefined, DD: undefined, MM: undefined, YYYY: undefined })
    }

    private close = () => {
        this.setState({ open: false })
    }

    private formatedValue = () => {
        const { hh, mm, ss, ms, DD, MM, YYYY } = this.state

        switch (this.props.type) {
            case 'time': {
                if (hh === undefined || mm === undefined || ss === undefined || ms === undefined)
                    return ''

                return `${hh}:${mm}:${ss}.${ms}`
            }
            case 'date': {
                if (DD === undefined || MM === undefined || YYYY === undefined)
                    return ''

                return `${DD}-${MM}-${YYYY}`
            }
            case 'datetime': {
                if (DD === undefined || MM === undefined || YYYY === undefined || hh === undefined || mm === undefined || ss === undefined || ms === undefined)
                    return ''

                return `${DD}-${MM}-${YYYY} ${hh}:${mm}:${ss}.${ms}`
            }
            default: return ''
        }
    }

    private onChange = (newState: State) => {
        const { hh, mm, ss, ms, DD, MM, YYYY } = newState

        const stamp = moment(`${DD}-${MM}-${YYYY} ${hh}:${mm}:${ss}.${ms}`, 'DD-MM-YYYY HH:mm:ss:SSS').valueOf()

        this.props.onChange(stamp)
    }
}

export default AnswerInputModal
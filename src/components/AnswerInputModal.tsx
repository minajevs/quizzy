import * as React from 'react'

import * as moment from 'moment'

import { Button, Icon, Modal, Input, Form } from 'semantic-ui-react'
import { UnitsMeasure } from 'models/question'

type Props = {
    type: UnitsMeasure
    label: React.ReactNode
    children: React.ReactNode
    button: React.ReactNode
    defaultValue?: number
    onChange: (value: number) => void
}

type State = {
    open: boolean
    defaultValue?: number
    DD?: string
    MM?: string
    YYYY?: string
    hh?: string
    mm?: string
    ss?: string
    ms?: string
}

const pad = (mask: string, value: string | number) => (mask + value).substring(value.toString().length)

class AnswerInputModal extends React.Component<Props, State>{
    constructor(props:Props){
        super(props)

        this.state.open = false

        this.state.defaultValue = this.props.defaultValue
    }
    state: State = {
        open: false
    }

    componentDidMount = () =>{
        this.setDefault(false)
    }

    render() {
        const { open, hh, mm, ss, ms } = this.state
        const { label, children, button, defaultValue } = this.props
        return (
            <>
                <Input onFocus={this.open} defaultValue={this.formatedValue()} fluid>
                    {label}
                    <input />
                    {children}
                    {button}
                </Input>
                <Modal open={open} onClose={this.cancel}>
                    <Modal.Header>{ defaultValue !== undefined ? 'Add answer' : 'Edit answer' }</Modal.Header>
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
                                <Form.Input label='Hours' width='4' type='number' onChange={this.numberChange('hh', 0, 99)} defaultValue={hh} />
                                <Form.Input label='Minutes' width='4' type='number' onChange={this.numberChange('mm', 0, 59)} defaultValue={mm} />
                                <Form.Input label='Seconds' width='4' type='number' onChange={this.numberChange('ss', 0, 59)} defaultValue={ss} />
                                <Form.Input label='Milliseconds' width='4' type='number' onChange={this.numberChange('ms', 0, 999, '000')} defaultValue={ms} />
                            </Form.Group>
                        </Form>
                    </>
                )
            case 'date':
                return (
                    <>
                        <Form>
                            <Form.Group>
                                <Form.Input label='Day' width='5' type='number' onChange={this.numberChange('DD', 1, 31)} defaultValue={DD} />
                                <Form.Input label='Month' width='5' type='number' onChange={this.numberChange('MM', 1, 12)} defaultValue={MM} />
                                <Form.Input label='Year' width='5' type='number' onChange={this.numberChange('YYYY', 0, 9999, '0000')} defaultValue={YYYY} />
                            </Form.Group>
                        </Form>
                    </>
                )
            case 'datetime':
                return (
                    <>
                        <Form>
                            <Form.Group>
                                <Form.Input label='Day' width='4' type='number' onChange={this.numberChange('DD', 1, 31)} defaultValue={DD} />
                                <Form.Input label='Month' width='4' type='number' onChange={this.numberChange('MM', 1, 12)} defaultValue={MM} />
                                <Form.Input label='Year' width='4' type='number' onChange={this.numberChange('YYYY', 0, 9999, '0000')} defaultValue={YYYY} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Input label='Hours' width='4' type='number' onChange={this.numberChange('hh', 0, 99)} defaultValue={hh} />
                                <Form.Input label='Minutes' width='4' type='number' onChange={this.numberChange('mm', 0, 59)} defaultValue={mm} />
                                <Form.Input label='Seconds' width='4' type='number' onChange={this.numberChange('ss', 0, 59)} defaultValue={ss} />
                                <Form.Input label='Milliseconds' width='4' type='number' onChange={this.numberChange('ms', 0, 999, '000')} defaultValue={ms} />
                            </Form.Group>
                        </Form>
                    </>
                )

            default: return ''
        }
    }

    private numberChange = (key: keyof State, min: number, max: number, mask: string = '00') => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        const num = parseFloat(event.target.value)

        if (value === '') {
            const state1 = { ...this.state, [key]: mask }
            this.setState(state1)
            // this.onChange(state1)
        }

        if (num < min || num > max)
            return

        const state2 = { ...this.state, [key]: pad(mask, value) }
        this.setState(state2)
        // this.onChange(state2)
    }

    private setDefault = (fill: boolean = true) => {
        let defaultState: State = this.state
        if(this.state.defaultValue !== undefined){
            const m = moment(this.state.defaultValue)
            defaultState = {
                ...this.state,
                DD: pad('00', m.days()),
                MM: pad('00', m.month()),
                YYYY: pad('0000', m.year()),
                hh: this.props.type === 'time' ? pad('00', m.diff(moment(0), 'hours', false)) : pad('00', m.hours()),
                mm: pad('00', m.minutes()),
                ss: pad('00', m.seconds()),
                ms: pad('000', m.milliseconds()),
            }
        }

        const f = (chars: string) => fill ? chars : undefined

        switch (this.props.type) {
            case 'time':
                this.setState({ hh: defaultState.hh ||  f('00'), mm: defaultState.mm || f('00'), ss: defaultState.ss || f('00'), ms: defaultState.ms || f('000') })
                break
            case 'date':
                this.setState({ DD: defaultState.DD || f('01'), MM: defaultState.MM || f('01'), YYYY: defaultState.YYYY || f('2018') })
                break
            case 'datetime':
                this.setState({ hh: defaultState.hh || f('00'), mm: defaultState.mm || f('00'), ss: defaultState.ss || f('00'), ms: defaultState.ms || f('000'), DD: defaultState.DD || f('01'), MM: defaultState.MM || f('01'), YYYY: defaultState.YYYY || f('2018') })
                break
        }
    }

    private open = () => {
        this.setState({ open: true, defaultValue: this.props.defaultValue },
        () => this.setDefault())
    }

    private cancel = () => {
        this.setState({ open: false })
        this.setDefault()
    }

    private close = () => {
        this.setState({ open: false })
        this.onChange(this.state)
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

        switch (this.props.type) {
            case 'time': {
                if (hh === undefined || mm === undefined || ss === undefined || ms === undefined)
                    return ''

                this.props.onChange(moment(0)
                    .add(hh, 'hours')
                    .add(mm, 'minutes')
                    .add(ss, 'seconds')
                    .add(ms, 'milliseconds')
                    .valueOf()
                )
                return
            }
            case 'date': {
                if (DD === undefined || MM === undefined || YYYY === undefined)
                    return ''

                this.props.onChange(moment(0)
                    .add(DD, 'days')
                    .add(MM, 'months')
                    .add(YYYY, 'years')
                    .valueOf()
                )
                return
            }
            case 'datetime': {
                if (DD === undefined || MM === undefined || YYYY === undefined || hh === undefined || mm === undefined || ss === undefined || ms === undefined)
                    return ''

                this.props.onChange(moment(0)
                    .add(hh, 'hours')
                    .add(mm, 'minutes')
                    .add(ss, 'seconds')
                    .add(ms, 'milliseconds')
                    .add(DD, 'days')
                    .add(MM, 'months')
                    .add(YYYY, 'years')
                    .valueOf()
                )
                return
            }
            default: return
        }
    }
}

export default AnswerInputModal
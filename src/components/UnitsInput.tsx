import * as React from 'react'

import { UnitsMeasure } from 'models/question'

import MaskedInput from 'react-text-mask'

import { Form, Icon, SemanticICONS, Dropdown, Container, Label } from 'semantic-ui-react'

type Props = {
    defaultValue?: UnitsMeasure
    onChange: (e: React.SyntheticEvent<HTMLInputElement>) => void
    onTypeChange: (type: UnitsMeasure) => void
    onKeyPress: (event: React.KeyboardEvent<Element>) => void
}

type State = {
    currentChoice: UnitsMeasure
}

class UnitsInput extends React.Component<Props, State> {
    state: State = { currentChoice: this.props.defaultValue || 'free' }
    render() {
        return (
            <>
            <label>Units:</label>
            {this.input()}
            </>
        )

        return (
            <>
                <label>Units:
                    {this.selectIcon('pencil', 'free')}
                    {this.selectIcon('clock', 'time')}
                    {this.selectIcon('calendar', 'date')}
                    {this.selectIcon('calendar check', 'datetime')}
                </label>
                {
                    this.input()
                }
                
            </>
        )
    }

    color = (value: UnitsMeasure) => this.state.currentChoice === value ? 'teal' : 'black'
    inverted = (value: UnitsMeasure) => this.state.currentChoice === value

    selectIcon = (name: SemanticICONS, value: UnitsMeasure) => (
        <Icon
            className='select-icon'
            name={name}
            bordered
            color={this.color(value)}
            inverted={this.inverted(value)}
            onClick={this.handleTypeChange(value)}
        />)

    input = () => {
        const { onChange, onKeyPress } = this.props
        const { currentChoice } = this.state
        switch(currentChoice){
            case 'free':
                return <Form.Input 
                    onChange={this.props.onChange} 
                    placeholder='beer(s)' 
                    type='text' 
                    onKeyPress={onKeyPress} 
                    fluid 
                />

            case 'time':
                return <Label icon='clock' size='large' content='time' className='middle-label' />
            case 'date':
                return <Label icon='calendar' size='large' content='date' className='middle-label' />
            case "datetime":
                return <Label icon='calendar check' size='large' content='date and time' className='middle-label' />
            default:
                return 'no input for dat'
        }
    }

    handleTypeChange = (type: UnitsMeasure) => (event: any) => {
        this.setState({ currentChoice: type })
        this.props.onTypeChange(type)        
    }
}

export default UnitsInput
import * as React from 'react'

import { UnitsMeasure } from 'models/question'

import { Form, Icon, SemanticICONS} from 'semantic-ui-react'

type Props = {
    onChange: (e:React.SyntheticEvent<HTMLInputElement>) => void
    onKeyPress: (event: React.KeyboardEvent<Element>) => void
}

type State = {
    currentChoice: UnitsMeasure
}

const inverted = (value: UnitsMeasure, state: State) => state.currentChoice === value 
const color = (value: UnitsMeasure, state: State) => state.currentChoice === value ? 'teal' : 'black'

const selectIcon = (name: SemanticICONS, value: UnitsMeasure, state: State) => 
    (<Icon className='select-icon' name={name} bordered color={color(value, state)} inverted={inverted(value, state)}/>)

class UnitsInput extends React.Component<Props, State> {
    state: State = {currentChoice: 'free'}
    render() {
        const { onChange, onKeyPress } = this.props
        const { currentChoice } = this.state
        return (
            <>
            <label>Units: 
                {selectIcon('pencil', 'free', this.state)}
                {selectIcon('clock', 'time', this.state)}
                {selectIcon('calendar', 'date', this.state)}
                {selectIcon('calendar check', 'datetime', this.state)}
            </label>
            <Form.Input onChange={onChange} placeholder='beer(s)' type='text' onKeyPress={onKeyPress} fluid /> 
            </>
        )
    }
}

export default UnitsInput
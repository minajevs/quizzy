import * as React from 'react'

import { UnitsMeasure } from 'models/question'

import { Form, Icon, SemanticICONS, Popup } from 'semantic-ui-react'

type Props = {
    defaultValue?: UnitsMeasure
    defaultUnits?: string
    onChange: (e: React.SyntheticEvent<HTMLInputElement>) => void
    onTypeChange: (type: UnitsMeasure) => void
    onKeyPress: (event: React.KeyboardEvent<Element>) => void
}

type State = {
    currentChoice: UnitsMeasure
}

const UnitsInput: React.FC<Props> = props => {
    const [state, setState] = React.useState<State>({ currentChoice: props.defaultValue || 'free' })
    const { onKeyPress } = props

    const color = React.useCallback((value: UnitsMeasure) => (state.currentChoice === value ? 'teal' : 'black'),
        [state.currentChoice])
    const inverted = React.useCallback((value: UnitsMeasure) => (state.currentChoice === value),
        [state.currentChoice])
    const handleTypeChange = React.useCallback((type: UnitsMeasure) => (event: any) => {
        setState({ currentChoice: type })
        props.onTypeChange(type)
    }, [props.onTypeChange])

    const selectIcon = React.useCallback((name: SemanticICONS, value: UnitsMeasure) => (
        <Popup
            content={value === 'free'
                ? 'Only numbers in answer will be allowed'
                : 'Any text will be allowed in answer'}
            trigger={
                <Icon
                    className='select-icon'
                    name={name}
                    bordered
                    color={color(value)}
                    inverted={inverted(value)}
                    onClick={handleTypeChange(value)}
                />
            }
        />), [color, inverted, handleTypeChange])

    return (
        <>
            <label>Units:
                {selectIcon('forward', 'free')}
                {selectIcon('keyboard', 'manual')}
            </label>
            <Form.Input
                onChange={props.onChange}
                defaultValue={props.defaultUnits}
                placeholder='beer(s)'
                type='text'
                onKeyPress={onKeyPress}
                fluid
                data-test='question-units'
            />
            Answer validation: {state.currentChoice === 'free' ? 'automatic' : 'manual'}
        </>
    )
}

export default UnitsInput
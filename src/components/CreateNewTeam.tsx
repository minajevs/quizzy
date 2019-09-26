import * as React from 'react'

import { context as appContext } from 'context/app'
import { useRouter } from 'HookedRouter'

import Validation from 'components/Validation'

import { Input, Button } from 'semantic-ui-react'

type State = {
    teamKey: string
    teamName: string
    validate: boolean
}

type Props = {
    teamKey?: string
}

const CreateNewTeam: React.FC<Props> = props => {
    const [state, setState] = React.useState<State>({ teamKey: props.teamKey || '', teamName: '', validate: false })
    const store = React.useContext(appContext)
    const router = useRouter()

    const notEmpty = React.useCallback((value: string) => (value !== ''), [])

    const onAddTeam = React.useCallback(async () => {
        console.log('cret')
        const { teamKey, teamName } = state

        if (!notEmpty(teamKey) || !notEmpty(teamName))
            return setState(prev => ({ ...prev, validate: true }))

        await store.createTeam(teamKey, teamName)
        router.history.push(`/t/${teamKey}`)
    }, [state.teamKey, state.teamName])

    const handleChange = React.useCallback((field: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist()
        setState(prev => ({ ...prev, [field]: event.target.value }))
    }, [])

    const onKeyPress = React.useCallback((expectedKey: string, func: () => void) => (event: React.KeyboardEvent) => {
        if (event.key === expectedKey)
            func()
    }, [])

    return (
        <>
            <Input
                fluid
                type="text"
                label='New team id'
                placeholder='New team id'
                defaultValue={state.teamKey}
                onChange={handleChange('teamKey')}
                data-test="new-team-id"
            />
            <Validation value={state.teamKey} error="Key can't be empty!" rule={notEmpty} validate={state.validate} />
            <br />
            <Input
                fluid
                type="text"
                label='New team name'
                placeholder='New team name'
                onKeyPress={onKeyPress('Enter', onAddTeam)}
                onChange={handleChange('teamName')}
                data-test="new-team-name"
            />
            <Validation value={state.teamName} error="Name can't be empty!" rule={notEmpty} validate={state.validate} />
            <br />
            <Button onClick={onAddTeam} color='teal' content='Create' labelPosition='right' icon='plus circle' data-test='create' />
        </>
    )
}

export default CreateNewTeam

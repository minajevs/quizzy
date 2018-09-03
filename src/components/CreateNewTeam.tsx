import * as React from 'react'

import Validation from 'components/Validation'

import { Input, Button } from 'semantic-ui-react'

type State = {
    teamKey: string
    teamName: string
    validate: boolean
}

type Props = {
    onAddTeam: (teamKey: string, teamName: string) => void
    teamKey?: string
}

class CreateNewTeam extends React.Component<Props, State> {
    state: State = {teamKey: this.props.teamKey || '', teamName: '', validate: false}
    render() {
        return (
            <>
                <Input
                    fluid
                    type="text"
                    label='New team id'
                    placeholder='New team id'
                    defaultValue={this.state.teamKey}
                    onChange={this.handleChange('teamKey')}
                />
                <Validation value={this.state.teamKey} error="Key can't be empty!" rule={this.notEmpty} validate={this.state.validate}/>
                <br />
                <Input
                    fluid
                    type="text"
                    label='New team name'
                    placeholder='New team name'
                    onKeyPress={this.onKeyPress('Enter', this.onAddTeam)}
                    onChange={this.handleChange('teamName')}
                />
                <Validation value={this.state.teamName} error="Name can't be empty!" rule={this.notEmpty} validate={this.state.validate}/>
                <br/>
                <Button onClick={this.onAddTeam} color='teal' content='Create' labelPosition='right' icon='plus circle' />
            </>
        )
    }

    private notEmpty = (value: string) => value !== ''

    private onAddTeam = () => {
        const { teamKey, teamName } = this.state

        if(!this.notEmpty(teamKey) || !this.notEmpty(teamName))
            return this.setState({validate: true})

        this.props.onAddTeam(teamKey, teamName)
    }

    private handleChange = (field: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, [field]: event.target.value })
    }

    private onKeyPress = (expectedKey: string, func: () => void) => (event: React.KeyboardEvent) => {
        if (event.key === expectedKey)
            func()
    }
}

export default CreateNewTeam


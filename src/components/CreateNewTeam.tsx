import * as React from 'react'
import { Input, Button } from 'semantic-ui-react'

type State = {
    teamKey: string
    teamName: string
}

type Props = {
    onAddTeam: (teamKey: string, teamName: string) => void
    teamKey?: string
}

class CreateNewTeam extends React.Component<Props, State> {
    state: State = {teamKey: this.props.teamKey || '', teamName: ''}
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
                <br />
                <Input
                    fluid
                    type="text"
                    label='New team name'
                    placeholder='New team name'
                    onKeyPress={this.onKeyPress('Enter', this.onAddTeam)}
                    onChange={this.handleChange('teamName')}
                />
                <br />
                <Button onClick={this.onAddTeam} color='teal' content='Create' labelPosition='right' icon='plus circle' />
            </>
        )
    }

    private onAddTeam = () => {
        this.props.onAddTeam(this.state.teamKey, this.state.teamName)
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


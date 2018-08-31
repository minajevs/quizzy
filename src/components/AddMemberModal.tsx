import * as React from 'react'

import MemberModel from 'models/member'

import { Button, Icon, Modal, Input } from 'semantic-ui-react'

type Props = {
    onAdd: (member: MemberModel) => void
    teamKey: string
}

type State = {
    open: boolean
    member: MemberModel
}

class AddMemberModal extends React.Component<Props, State>{
    state: State = {open: false, member: {key: '', name: '', points: 0, team: this.props.teamKey}}
    render() {
        return (
            <>
                <Button icon={true} labelPosition='left' onClick={this.show}>
                    <Icon name='add circle' />
                    Add member
                </Button>
                <Modal open={this.state.open}>
                    <Modal.Header>New member</Modal.Header>
                    <Modal.Content>
                        <Input onChange={this.handleChange('name')} label='Name' placeholder='John Doe' type='text' onKeyPress={this.onKeyPress('Enter', this.add)}/>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button negative onClick={this.cancel}>Cancel</Button>
                        <Button positive onClick={this.add} icon='add' labelPosition='right' content='Add' />
                    </Modal.Actions>
                </Modal>
            </>
        )
    }

    private onKeyPress = (expectedKey: string, func: () => void) => (event: React.KeyboardEvent) => {
        if(event.key === expectedKey)
          func()
      }

    private handleChange = (field: keyof MemberModel) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({...this.state, member: {...this.state.member, [field]: event.target.value}})
    }

    private show = () => {
        this.setState({ open: true, member: {key: '', name: '', points: 0, team: this.props.teamKey}})
    }

    private add = () => {
        this.props.onAdd(this.state.member)
        this.cancel()
    }

    private cancel = () => {
        this.setState({ open: false })
    }
}

export default AddMemberModal
import * as React from 'react'

import MemberModel from 'models/member'

import { Button, Icon, Modal, Input } from 'semantic-ui-react'

type Props = {
    open: boolean
    onSave: (member: MemberModel) => void
    onClose: () => void
    member: MemberModel
}

type State = {
    member: MemberModel
}

class EditMemberModal extends React.Component<Props, State>{
    state: State = { member: this.props.member }
    render() {
        const { member } = this.state
        const { open, onClose, onSave } = this.props
        return (
            <>
                <Modal open={open}>
                    <Modal.Header>Edit "{member.name}"</Modal.Header>
                    <Modal.Content>
                        <Input onChange={this.handleChange('name')} label='Name' value={member.name} type='text' onKeyPress={this.onKeyPress('Enter', this.save)} />
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button negative disabled onClick={onClose} icon='delete' labelPosition='right' content='Remove' />
                        <Button positive onClick={this.save} icon='save' labelPosition='right' content='Save' />
                    </Modal.Actions>
                </Modal>
            </>
        )
    }

    private onKeyPress = (expectedKey: string, func: () => void) => (event: React.KeyboardEvent) => {
        if (event.key === expectedKey)
            func()
    }

    private handleChange = (field: keyof MemberModel) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, member: { ...this.state.member, [field]: event.target.value } })
    }

    private save = () => {
        this.props.onSave(this.state.member)
    }
}

export default EditMemberModal
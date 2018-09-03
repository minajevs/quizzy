import * as React from 'react'

import MemberModel from 'models/member'

import Validation from './Validation'

import { Button, Icon, Modal, Input } from 'semantic-ui-react'

type Props = {
    open: boolean
    onSave: (member: MemberModel) => void
    onClose: () => void
    member: MemberModel
}

type State = {
    member: MemberModel,
    validate: boolean
}

class EditMemberModal extends React.Component<Props, State>{
    state: State = { member: this.props.member, validate: false }
    render() {
        const { member, validate } = this.state
        const { open, onClose, onSave } = this.props
        return (
            <>
                <Modal open={open}>
                    <Modal.Header>Edit "{member.name}"</Modal.Header>
                    <Modal.Content>
                        <Input onChange={this.handleChange('name')} label='Name' value={member.name} type='text' onKeyPress={this.onKeyPress('Enter', this.save)} />
                        <Validation value={member.name} error="Member name can't be empty!" rule={this.notEmpty} validate={validate}/>
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

    private notEmpty = (value: string) => value !== ''

    private onKeyPress = (expectedKey: string, func: () => void) => (event: React.KeyboardEvent) => {
        if (event.key === expectedKey)
            func()
    }

    private handleChange = (field: keyof MemberModel) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, member: { ...this.state.member, [field]: event.target.value } })
    }

    private save = () => {
        if(!this.notEmpty(this.state.member.name))
            return this.setState({validate: true})

        this.props.onSave(this.state.member)
    }
}

export default EditMemberModal
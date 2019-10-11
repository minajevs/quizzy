import * as React from 'react'

import MemberModel from 'models/member'
import UserModel from 'models/user'

import Validation from './Validation'

import { Button, Icon, Modal, Input, Popup, Container, Label } from 'semantic-ui-react'

type Props = {
    open: boolean
    onSave: (member: MemberModel) => void
    onClose: () => void
    member: MemberModel
    user: UserModel | null
}

type State = {
    member: MemberModel,
    validate: boolean
}

const EditMemberModal: React.FC<Props> = props => {
    const [state, setState] = React.useState<State>({ member: props.member, validate: false })

    const { member, validate } = state
    const { open, onClose, onSave } = props

    const notEmpty = React.useCallback((value: string) => (value !== ''), [])

    const onKeyPress = React.useCallback((expectedKey: string, func: () => void) => (event: React.KeyboardEvent) => {
        if (event.key === expectedKey)
            func()
    }, [])

    const handleChange = React.useCallback((field: keyof MemberModel) => (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist()
        setState(prev => ({ ...prev, member: { ...prev.member, [field]: event.target.value } }))
    }, [])

    const save = React.useCallback(() => {
        if (!notEmpty(state.member.name))
            return setState(prev => ({ ...prev, validate: true }))

        props.onSave(state.member)
    }, [props.onSave, state.member])

    const emailField = React.useMemo(() => {
        if (props.user === null) {
            return (
                <>
                    <Popup trigger={<Icon name="question circle outline" />} content='Only user with that email will be allowed to a team' />
                    <Input fluid onChange={handleChange('inviteEmail')} placeholder='john@example.com' type='text' value={state.member.inviteEmail} onKeyPress={onKeyPress('Enter', save)} data-test='edit-member-email' />
                </>
            )
        } else {
            return (
                <Container fluid>
                    <Popup
                        trigger={<Icon color="green" name="check" />}
                        content={props.user.email}
                        position="bottom center" />
                    User already joined
                </Container>
            )
        }
    }, [props.user, state.member, onKeyPress, save])

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Modal.Header>Edit "{member.name}"</Modal.Header>
                <Modal.Content>
                    <label>Member name</label>
                    <Input onChange={handleChange('name')} value={member.name} fluid type='text' onKeyPress={onKeyPress('Enter', save)} data-test='edit-member-name' />
                    <Validation value={member.name} error="Member name can't be empty!" rule={notEmpty} validate={validate} />
                    <label>Email</label>
                    {emailField}
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button negative disabled onClick={onClose} icon='delete' labelPosition='right' content='Remove' />
                    <Button positive onClick={save} icon='save' labelPosition='right' content='Save' data-test='save-member' />
                </Modal.Actions>
            </Modal>
        </>
    )
}

export default EditMemberModal
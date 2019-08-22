import * as React from 'react'

import MemberModel from 'models/member'

import Validation from 'components/Validation'

import { Button, Icon, Modal, Input, Popup } from 'semantic-ui-react'

import { context as membersContext } from 'context/members'

type State = {
    open: boolean
    member: MemberModel
    validate: boolean
}

const AddMemberModal: React.FC = props => {
    const [state, setState] = React.useState<State>({
        open: false,
        member: { key: '', name: '', points: 0, team: '', isAdmin: false },
        validate: false
    })

    const membersStore = React.useContext(membersContext)

    const notEmpty = React.useCallback((value: string) => (value !== ''), [])
    const onKeyPress = React.useCallback((expectedKey: string, func: () => void) => (event: React.KeyboardEvent) => {
        if (event.key === expectedKey)
            func()
    }, [])

    const handleChange = React.useCallback((field: keyof MemberModel) => (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist()
        setState(prev => ({ ...prev, member: { ...prev.member, [field]: event.target.value } }))
    }, [])

    const show = React.useCallback(() => {
        setState({ open: true, validate: false, member: { key: '', name: '', points: 0, team: 'will be set in store', isAdmin: false } })
    }, [])

    const add = React.useCallback(() => {
        if (!notEmpty(state.member.name))
            return setState(prev => ({ ...prev, validate: true }))

        membersStore.addMember({ ...state.member })
        cancel()
    }, [state.member, membersStore.addMember])

    const cancel = React.useCallback(() => {
        setState(prev => ({ ...prev, open: false, validate: false }))
    }, [])

    return (
        <>
            <Button icon={true} labelPosition='left' onClick={show}>
                <Icon name='add circle' />
                Add member
                </Button>
            <Modal open={state.open} onClose={cancel}>
                <Modal.Header>New member</Modal.Header>
                <Modal.Content>
                    <label>Member name</label>
                    <Input fluid onChange={handleChange('name')} placeholder='John Doe' type='text' onKeyPress={onKeyPress('Enter', add)} />
                    <Validation value={state.member.name} error="Member name can't be empty!" rule={notEmpty} validate={state.validate} />
                    <label>Email</label>
                    <Popup trigger={<Icon name="question circle outline" />} content='Only user with that email will be allowed to a team' />
                    <Input fluid onChange={handleChange('inviteEmail')} placeholder='john@example.com' type='text' onKeyPress={onKeyPress('Enter', add)} />
                </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={cancel}>Cancel</Button>
                    <Button positive onClick={add} icon='add' labelPosition='right' content='Add' />
                </Modal.Actions>
            </Modal>
        </>
    )
}

export default AddMemberModal
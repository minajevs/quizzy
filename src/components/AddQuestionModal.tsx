import * as React from 'react'
import * as moment from 'moment'

import QuestionModel, { UnitsMeasure } from 'models/question'
import MemberModel from 'models/member'

import Validation from 'components/Validation'
import UnitsInput from 'components/UnitsInput'

import { Button, Icon, Modal, Input, Dropdown, DropdownItemProps, DropdownProps, Divider, TextArea, Form, Message, Popup } from 'semantic-ui-react'

type Props = {
    onAdd: (question: QuestionModel) => void
    teamKey: string
    members: MemberModel[]
}

type State = {
    open: boolean
    question: QuestionModel
    validate: boolean
}

const createDropDownOptions = (members: MemberModel[]): DropdownItemProps[] => members.map<DropdownItemProps>(member => ({
    text: member.name,
    value: member.key
}))

const AddMemberModal: React.FC<Props> = props => {
    const [state, setState] = React.useState<State>({
        open: false,
        question: {
            key: '',
            author: '',
            answer: null,
            date: new Date().getTime(),
            text: '',
            description: '',
            units: '',
            unitsMeasure: 'free',
            team: props.teamKey,
        },
        validate: false
    })

    const notEmpty = React.useCallback((value: string) => (value !== ''), [])
    const onKeyPress = React.useCallback((expectedKey: string, func: () => void) => (event: React.KeyboardEvent) => {
        if (event.key === expectedKey)
            func()
    }, [])
    const handleChange = React.useCallback((field: keyof QuestionModel) => (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist()
        setState(prev => ({ ...prev, question: { ...prev.question, [field]: event.target.value } }))
    }, [])
    const handleTypeChange = React.useCallback((field: keyof QuestionModel) => (units: UnitsMeasure) => {
        setState(prev => ({ ...prev, question: { ...prev.question, [field]: units } }))
    }, [])
    const handleTextAreaChange = React.useCallback((field: keyof QuestionModel) => (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        event.persist()
        setState(prev => ({ ...prev, question: { ...prev.question, [field]: event.target.value } }))
    }, [])
    const handleDropdown = React.useCallback((event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        setState(prev => ({ ...prev, question: { ...prev.question, author: data.value as string } }))
    }, [])
    const show = React.useCallback(() => {
        setState({ open: true, validate: false, question: { key: '', author: '', answer: null, date: new Date().getTime(), text: '', description: '', unitsMeasure: 'free', units: '', team: props.teamKey } })
    }, [props])
    const add = React.useCallback(() => {
        const { question } = state
        if (!notEmpty(question.author) || !notEmpty(question.text))
            return setState(prev => ({ ...prev, validate: true }))

        props.onAdd(state.question)
        cancel()
    }, [state, props])
    const cancel = React.useCallback(() => {
        setState(prev => ({ ...prev, open: false, validate: false }))
    }, [])

    const { members } = props
    const { validate } = state

    return (
        <>
            <Button icon={true} labelPosition='left' onClick={show}>
                <Icon name='add circle' />
                Add Question
                </Button>
            <Divider />
            <Modal open={state.open} onClose={cancel}>
                <Modal.Header>New question</Modal.Header>
                <Modal.Content>
                    <label>Author</label>
                    <Dropdown placeholder='John Doe' selection={true} options={createDropDownOptions(members)} onChange={handleDropdown} fluid />
                    <Validation value={state.question.author} error='Please choose an author!' rule={notEmpty} validate={validate} />
                    <label>Description <Popup trigger={<Icon name='exclamation circle' />} content='Markdown supported!' /></label>
                    <Form>
                        <TextArea onChange={handleTextAreaChange('description')} placeholder='1 drink is too few and 3 drinks is too many.' />
                    </Form>
                    <Form>
                        <Form.Group>
                            <Form.Input label='Question' onChange={handleChange('text')} width='12' placeholder='How many beers is enough?' type='text' onKeyPress={onKeyPress('Enter', add)} />
                            <Form.Field width='4'>
                                <UnitsInput onChange={handleChange('units')} onTypeChange={handleTypeChange('unitsMeasure')} onKeyPress={onKeyPress('Enter', add)} />
                            </Form.Field>
                        </Form.Group>
                    </Form>
                    <Validation value={state.question.text} error="Question can't be empty" rule={notEmpty} validate={validate} />
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
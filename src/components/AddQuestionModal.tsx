import * as React from 'react'
import * as moment from 'moment'

import QuestionModel from 'models/question'
import MemberModel from 'models/member'

import Validation from './Validation'

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

class AddMemberModal extends React.Component<Props, State>{
    state: State = {
        open: false,
        question: {
            key: '',
            author: '',
            authorName: '',
            answer: null,
            date: new Date().getTime(),
            text: '',
            description: '',
            units: '',
            team: this.props.teamKey,    
        },
        validate: false
    }
    render() {
        const { members } = this.props
        const { validate } = this.state
        return (
            <>
                <Button icon={true} labelPosition='left' onClick={this.show}>
                    <Icon name='add circle' />
                    Add Question
                </Button>
                <Divider />
                <Modal open={this.state.open}>
                    <Modal.Header>New question</Modal.Header>
                    <Modal.Content>
                        <label>Author</label>
                        <Dropdown placeholder='John Doe' selection={true} options={createDropDownOptions(members)} onChange={this.handleDropdown} fluid />
                        <Validation value={this.state.question.author} error='Please choose an author!' rule={this.notEmpty} validate={validate} />
                        <label>Description <Popup trigger={<Icon name='exclamation circle' />} content='Markdown supported!' /></label>
                        <Form>
                            <TextArea onChange={this.handleTextAreaChange('description')} placeholder='1 drink is too few and 3 drinks is too many.' />
                        </Form>
                        <Form>
                            <Form.Group>
                                <Form.Input label='Question' onChange={this.handleChange('text')} width='12' placeholder='How many beers is enough?' type='text' onKeyPress={this.onKeyPress('Enter', this.add)} /> 
                                <Form.Input label='Units of measure' onChange={this.handleChange('units')} width='4' placeholder='beer(s)' type='text' onKeyPress={this.onKeyPress('Enter', this.add)} /> 
                            </Form.Group>
                        </Form>
                        <Validation value={this.state.question.text} error="Question can't be empty" rule={this.notEmpty} validate={validate} />
                    </Modal.Content>
                    <Modal.Actions>
                        <Button negative onClick={this.cancel}>Cancel</Button>
                        <Button positive onClick={this.add} icon='add' labelPosition='right' content='Add' />
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

    private handleChange = (field: keyof QuestionModel) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, question: { ...this.state.question, [field]: event.target.value } })
    }

    private handleTextAreaChange = (field: keyof QuestionModel) => (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ ...this.state, question: { ...this.state.question, [field]: event.target.value } })
    }

    private handleDropdown = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        this.setState({ ...this.state, question: { ...this.state.question, author: data.value as string } })
    }

    private show = () => {
        this.setState({ open: true, question: { key: '', author: '', authorName: '', answer: null, date: new Date().getTime(), text: '', description: '', units: '', team: this.props.teamKey } })
    }

    private add = () => {
        const { question } = this.state
        if (!this.notEmpty(question.author) || !this.notEmpty(question.text))
            return this.setState({ validate: true })

        this.props.onAdd(this.state.question)
        this.cancel()
    }

    private cancel = () => {
        this.setState({ open: false })
    }
}

export default AddMemberModal
import * as React from 'react'

import QuestionModel from 'models/question'

import Validation from './Validation'

import { Button, Modal, Input, Form, TextArea, Message, Icon, Popup } from 'semantic-ui-react'

type Props = {
    open: boolean
    onSave: (question: QuestionModel) => void
    onClose: () => void
    question: QuestionModel
}

type State = {
    question: QuestionModel,
    validate: boolean
}

class EditQuestionModal extends React.Component<Props, State>{
    state: State = {
        question: this.props.question,
        validate: false
    }
    render() {
        const { question, validate } = this.state
        const { open, onClose, onSave } = this.props
        return (
            <>
                <Modal open={open}>
                    <Modal.Header>Edit question</Modal.Header>
                    <Modal.Content>
                        <label>Description <Popup trigger={<Icon name='exclamation circle' />} content='Markdown supported!' /></label>
                        <Form>
                            <TextArea autoHeight onChange={this.handleTextAreaChange('description')} value={question.description} placeholder='1 drink is too few and 3 drinks is too many.' />
                        </Form>
                        <Form>
                            <Form.Group>
                                <Form.Input label='Question' onChange={this.handleChange('text')} value={question.text} width='12' placeholder='How many beers is enough?' type='text' onKeyPress={this.onKeyPress('Enter', this.save)} /> 
                                <Form.Input label='Units of measure' onChange={this.handleChange('units')} value={question.units} width='4' placeholder='beer(s)' type='text' onKeyPress={this.onKeyPress('Enter', this.save)} /> 
                            </Form.Group>
                        </Form>
                        <Validation value={question.text} error="Question text can't be empty!" rule={this.notEmpty} validate={validate} />
                        <label>Answer</label>
                        <Input onChange={this.handleChange('answer')} fluid defaultValue={question.answer} type='number' onKeyPress={this.onKeyPress('Enter', this.save)} />
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

    private handleChange = (field: keyof QuestionModel) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, question: { ...this.state.question, [field]: event.target.value } })
    }

    private handleTextAreaChange = (field: keyof QuestionModel) => (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ ...this.state, question: { ...this.state.question, [field]: event.target.value } })
    }

    private save = () => {
        if (!this.notEmpty(this.state.question.text))
            return this.setState({ validate: true })

        this.props.onSave(this.state.question)
    }
}

export default EditQuestionModal
import * as React from 'react'

import QuestionModel from 'models/question'

import Validation from './Validation'

import { Button, Modal, Input } from 'semantic-ui-react'

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
                        <label>Question</label>
                        <Input onChange={this.handleChange('text')} fluid value={question.text} type='text' />
                        <Validation value={question.text} error="Question text can't be empty!" rule={this.notEmpty} validate={validate}/>
                        <label>Answer</label>
                        <Input onChange={this.handleChange('answer')} fluid value={question.answer} type='number' onKeyPress={this.onKeyPress('Enter', this.save)} />
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
        if(event.key === expectedKey)
          func()
      }

    private handleChange = (field: keyof QuestionModel) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, question: { ...this.state.question, [field]: event.target.value } })
    }

    private save = () => {
        if(!this.notEmpty(this.state.question.text))
            return this.setState({validate: true})

        this.props.onSave(this.state.question)
    }
}

export default EditQuestionModal
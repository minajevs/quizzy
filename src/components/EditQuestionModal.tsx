import * as React from 'react'

import QuestionModel from 'models/question'

import { Button, Icon, Modal, Input } from 'semantic-ui-react'

type Props = {
    open: boolean
    onSave: (question: QuestionModel) => void
    onClose: () => void
    question: QuestionModel
}

type State = {
    question: QuestionModel
}

class EditQuestionModal extends React.Component<Props, State>{
    state: State = { question: this.props.question }
    render() {
        const { question } = this.state
        const { open, onClose, onSave } = this.props
        return (
            <>
                <Modal open={open}>
                    <Modal.Header>Edit question</Modal.Header>
                    <Modal.Content>
                        <Input onChange={this.handleChange('text')} label='Text' value={question.text} type='text' />
                        <Input onChange={this.handleChange('answer')} label='Answer' value={question.answer || 0} type='number' onKeyPress={this.onKeyPress('Enter', this.save)} />
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
        if(event.key === expectedKey)
          func()
      }

    private handleChange = (field: keyof QuestionModel) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, question: { ...this.state.question, [field]: event.target.value } })
    }

    private save = () => {
        this.props.onSave(this.state.question)
    }
}

export default EditQuestionModal
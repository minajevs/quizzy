import * as React from 'react'

import QuestionModel, { UnitsMeasure } from 'models/question'

import Validation from 'components/Validation'
import UnitsInput from 'components/UnitsInput'
import AnswerInput from 'components/AnswerInput'

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

const EditQuestionModal: React.FC<Props> = props => {
    const [state, setState] = React.useState<State>({
        question: props.question,
        validate: false
    })

    const notEmpty = React.useCallback((value: string) => (value !== ''), [])

    const onKeyPress = React.useCallback((expectedKey: string, func: () => void) => (event: React.KeyboardEvent) => {
        if (event.key === expectedKey)
            func()
    }, [])

    const handleAnswer = React.useCallback((value: number) => {
        setState(prev => ({ ...prev, question: { ...prev.question, answer: value } }))
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

    const save = React.useCallback(() => {
        if (!notEmpty(state.question.text))
            return setState(prev => ({ ...prev, validate: true }))

        props.onSave(state.question)
    }, [state.question, props.onSave])

    return (
        <>
            <Modal open={props.open} onClose={props.onClose}>
                <Modal.Header>Edit question</Modal.Header>
                <Modal.Content>
                    <label>Description <Popup trigger={<Icon name='exclamation circle' />} content='Markdown supported!' /></label>
                    <Form>
                        <TextArea autoHeight onChange={handleTextAreaChange('description')} value={state.question.description} placeholder='1 drink is too few and 3 drinks is too many.' />
                    </Form>
                    <Form>
                        <Form.Group>
                            <Form.Input label='Question' onChange={handleChange('text')} value={state.question.text} width='12' placeholder='How many beers is enough?' type='text' onKeyPress={onKeyPress('Enter', save)} />
                            <Form.Field width='4'>
                                <UnitsInput defaultUnits={state.question.units} defaultValue={state.question.unitsMeasure} onChange={handleChange('units')} onTypeChange={handleTypeChange('unitsMeasure')} onKeyPress={onKeyPress('Enter', save)} />
                            </Form.Field>
                        </Form.Group>
                    </Form>
                    <Validation value={state.question.text} error="Question text can't be empty!" rule={notEmpty} validate={state.validate} />
                    <label>Answer</label>
                    <AnswerInput defaultValue={state.question.answer || undefined} onChange={handleAnswer} type={state.question.unitsMeasure} onKeyPress={onKeyPress('Enter', save)} />
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={props.onClose}>Cancel</Button>
                    <Button negative disabled onClick={props.onClose} icon='delete' labelPosition='right' content='Remove' />
                    <Button positive onClick={save} icon='save' labelPosition='right' content='Save' />
                </Modal.Actions>
            </Modal>
        </>
    )
}

export default EditQuestionModal
import * as React from 'react'

import AnswerModel from 'models/answer'
import MemberModel from 'models/member'

import AnswerInput from 'components/AnswerInput'

import { Label, List, Container, Image, Input, Button } from 'semantic-ui-react'
import { UnitsMeasure } from 'models/question'

import { context as questionsContext } from 'context/questions'
import { context as answersContext } from 'context/answers'
import { context as membersContext } from 'context/members'

type Props = {
    type: UnitsMeasure
    answer: AnswerModel
    units: string
    answersClosed: boolean
}

type State = {
    currentAnswer: AnswerModel
}

const Answer: React.FC<Props> = props => {
    const questionsStore = React.useContext(questionsContext)
    const answersStore = React.useContext(answersContext)
    const membersStore = React.useContext(membersContext)

    const { latestQuestion } = questionsStore
    const { members } = membersStore

    if (latestQuestion === null) return null
    if (members === null) return <>Members not found</>

    const [state, setState] = React.useState<State>({
        currentAnswer: { ...props.answer }
    })

    const showInput = React.useMemo(() => ((props.answer.answer === undefined || props.answer.answer === null) && props.answer.shouldAnswer),
        [props.answer])

    const authorName = React.useCallback((key: string) => members.find(x => x.key === key)!.name, [members])

    const onKeyPress = React.useCallback((expectedKey: string, func: () => void) => (event: React.KeyboardEvent) => {
        if (event.key === expectedKey)
            func()
    }, [])

    const onExclude = React.useCallback(() => {
        answersStore.addAnswer({ ...state.currentAnswer, shouldAnswer: false })
    }, [props, state])

    const onSave = React.useCallback(() => {
        answersStore.addAnswer(state.currentAnswer)
    }, [props, state])

    const handleChange = React.useCallback((field: keyof AnswerModel) => (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist()
        setState(prev => ({ ...prev, currentAnswer: { ...prev.currentAnswer, [field]: event.target.value } }))
    }, [])

    const onChange = React.useCallback((field: keyof AnswerModel) => (value: number) => {
        setState(prev => ({ ...prev, currentAnswer: { ...prev.currentAnswer, [field]: value } }))
    }, [])

    const renderContent = React.useCallback(() => {
        const { answer, units, type, answersClosed } = props
        const { currentAnswer } = state

        if (answersClosed)
            return showInput
                ? <Container text fluid>
                    <Label color='red' size='large'>{authorName(answer.author)}</Label>  did not answer
                    </Container>
                : <Container text fluid>
                    <Label color='green' size='large'>{authorName(answer.author)}</Label>  answered
                    </Container>
        else if (showInput)
            return <>
                <AnswerInput
                    onChange={onChange('answer')}
                    onKeyPress={onKeyPress('Enter', onSave)}
                    type={type}
                    label={<Label size='large'>{authorName(answer.author)}</Label>}
                    button={
                        <Button.Group>
                            <Button content='Exclude' onClick={onExclude} />
                            <Button.Or text='or' />
                            <Button color='teal' labelPosition='right' icon='check' content='Save' onClick={onSave} />
                        </Button.Group>}
                >
                    {units !== '' && units !== undefined
                        ? <Label basic size='large'>{units}</Label>
                        : null
                    }
                </AnswerInput>
            </>
        else
            return answer.shouldAnswer
                ? <Container text fluid>
                    <Label color='green' size='large'>{authorName(answer.author)}</Label>  answered
               </Container>
                : <Container text fluid>
                    <Label color='grey' size='large'>{authorName(answer.author)}</Label>  will not answer today
               </Container>
    }, [state, props])

    return (
        <>
            <List.Item>
                <List.Content>
                    <List.Description>
                        {renderContent()}
                    </List.Description>
                </List.Content>
            </List.Item>
        </>
    )
}

export default Answer
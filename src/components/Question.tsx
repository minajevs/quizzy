import * as React from 'react'
import * as moment from 'moment'

import AnswerModel from 'models/answer'
import QuestionModel, { UnitsMeasure } from 'models/question'
import MemberModel from 'models/member'

import { Grid, Label, Item, Image, Accordion, Button, Icon, Container } from 'semantic-ui-react'
import EditQuestionModal from 'components/EditQuestionModal'
import ViewQuestionModal from './ViewQuestionModal';

type Props = {
    question: QuestionModel
    members: MemberModel[]
    answers: AnswerModel[]
    onSaveQuestion: (question: QuestionModel) => void
}

type State = {
    editing: boolean
    open: boolean
}

const answer = (ans: number | null, units: UnitsMeasure, unitsString: string) => {
    if (ans === null || ans === undefined)
        return null

    return <div>Answer is: {ans.toString()} {unitsString}</div>
}

const diff = (stamp: number, unitOfTime: moment.unitOfTime.Diff) => moment(stamp).diff(moment(0), unitOfTime, false)

const authorName = (members: MemberModel[], key: string) => (members.find(x => x.key === key) as MemberModel).name

const Question: React.FC<Props> = props => {
    const [state, setState] = React.useState<State>({ editing: false, open: false })

    const { question, answers, members } = props
    const { editing, open } = state

    const onEdit = React.useCallback(() => {
        setState(prev => ({ ...prev, open: false, editing: true }))
    }, [])

    const onOpen = React.useCallback(() => {
        setState(prev => ({ ...prev, open: true }))
    }, [])

    const onModalClose = React.useCallback(() => {
        setState(prev => ({ ...prev, editing: false, open: false }))
    }, [])

    const onSave = React.useCallback((quest: QuestionModel) => {
        props.onSaveQuestion(quest)
        setState(prev => ({ ...prev, editing: false }))
    }, [props.onSaveQuestion])

    const toggle = React.useCallback(() => {
        setState(prev => ({ ...prev, open: !prev.open }))
    }, [])

    return (
        <>
            <Item className='question-item' onClick={onOpen}>
                <Item.Image size='mini'>
                    <Label>{moment(question.date).format('DD MMM')}</Label>
                </Item.Image>
                <Item.Content>
                    <Item.Content>
                        <Container text fluid>{question.text}</Container>
                    </Item.Content>
                    <Item.Meta>
                        By {authorName(members, question.author)}
                    </Item.Meta>
                    <Item.Description>
                        <Container>
                            {answer(question.answer, question.unitsMeasure, question.units)}
                        </Container>
                    </Item.Description>
                </Item.Content>
            </Item>
            {
                editing
                    ? <EditQuestionModal
                        open={editing}
                        question={question}
                        onSave={onSave}
                        onClose={onModalClose}
                    />
                    : null
            }
            {
                open
                    ? <ViewQuestionModal
                        open={open}
                        question={question}
                        answers={answers}
                        members={members}
                        onClose={onModalClose}
                        onEdit={onEdit}
                    />
                    : null
            }
        </>
    )
}

export default Question
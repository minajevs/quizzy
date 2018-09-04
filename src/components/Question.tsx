import * as React from 'react'
import * as moment from 'moment'

import AnswerModel from 'models/answer'
import QuestionModel from 'models/question'
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

const answer = (ans: number | null) => {
    return ans !== null && ans !== undefined
        ? <div>Answer is: {ans} </div>
        : null
}

class Member extends React.Component<Props, State> {
    state: State = { editing: false, open: false }
    public render() {
        const { question, answers, members } = this.props
        const { editing, open } = this.state
        return (
            <>
                <Item className='question-item' onClick={this.onOpen}>
                    <Item.Image size='mini'>
                        <Label>{moment(question.date).format('DD MMM')}</Label>
                    </Item.Image>
                    <Item.Content>
                        <Item.Content>
                            <Container text fluid>{question.text}</Container>
                        </Item.Content>
                        <Item.Meta>
                            By {question.authorName}
                        </Item.Meta>
                        <Item.Description>
                            <Container>
                                {answer(question.answer)}
                            </Container>
                        </Item.Description>
                    </Item.Content>
                </Item>
                <EditQuestionModal
                    open={editing}
                    question={question}
                    onSave={this.onSave}
                    onClose={this.onModalClose}
                />
                <ViewQuestionModal
                    open={open}
                    question={question}
                    answers={answers}
                    members={members}
                    onClose={this.onModalClose}
                    onEdit={this.onEdit}
                />
            </>
        )
    }

    private onEdit = () => {
        this.setState({ ...this.state, open: false, editing: true })
    }

    private onOpen = () => {
        this.setState({ ...this.state, open: true })
    }

    private onModalClose = () => {
        this.setState({ ...this.state, editing: false, open: false })
    }

    private onSave = (question: QuestionModel) => {
        this.props.onSaveQuestion(question)
        this.setState({ ...this.state, editing: false })
    }

    private toggle = () => {
        this.setState({ ...this.state, open: !this.state.open })
    }
}

export default Member
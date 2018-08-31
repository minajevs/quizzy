import * as React from 'react'
import * as moment from 'moment'
import QuestionModel from 'models/question'

import { Grid, Label, Item, Image, Accordion, Button, Icon, Container } from 'semantic-ui-react'
import EditQuestionModal from 'components/EditQuestionModal'

type Props = {
    question: QuestionModel
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
        const { question } = this.props
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
                            <Container>{answer(question.answer)}</Container>
                        </Item.Description>
                    </Item.Content>
                </Item>
                <EditQuestionModal
                    open={editing}
                    question={question}
                    onSave={this.onSave}
                    onClose={this.onModalClose}
                />
            </>
        )
    }

    private onOpen = () => {
        this.setState({ ...this.state, editing: true })
    }

    private onModalClose = () => {
        this.setState({ ...this.state, editing: false })
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
import * as React from 'react'
import AnswerModel from 'models/answer'
import { Label, List, Container, Image, Input } from 'semantic-ui-react'

type Props = {
    answer: AnswerModel
    onAdd: (answer: AnswerModel) => void
}

type State = {
    currentAnswer: AnswerModel
}

const answered = (answer: AnswerModel) => answer.answer !== undefined

class Answer extends React.Component<Props, State> {
    state: State = { currentAnswer: { ...this.props.answer } }
    public render() {
        const { answer } = this.props
        const { currentAnswer } = this.state
        return (
            <>
                <List.Item>
                    <List.Content>
                        <List.Description>
                            {!answered(answer)
                                ? <Input
                                    fluid
                                    label={answer.authorName}
                                    action={{ color: 'teal', labelPosition: 'right', icon: 'check', content: 'Save', onClick: this.onSave }}
                                    defaultValue={currentAnswer}
                                    onChange={this.handleChange('answer')}
                                    onKeyPress={this.onKeyPress('Enter', this.onSave)}
                                    type='number'
                                />
                                : <Container text fluid>
                                    <Label color='green' size='large'>{answer.authorName}</Label>  answered
                                </Container>
                            }
                        </List.Description>
                    </List.Content>
                </List.Item>
            </>
        )
    }

    private onKeyPress = (expectedKey: string, func: () => void) => (event: React.KeyboardEvent) => {
        if(event.key === expectedKey)
          func()
      }

    private onSave = () => {
        this.props.onAdd(this.state.currentAnswer)
    }

    private handleChange = (field: keyof AnswerModel) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, currentAnswer: { ...this.state.currentAnswer, [field]: event.target.value } })
    }
}

export default Answer
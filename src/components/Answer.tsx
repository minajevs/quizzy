import * as React from 'react'

import AnswerModel from 'models/answer'
import MemberModel from 'models/member'

import AnswerInput from 'components/AnswerInput'

import { Label, List, Container, Image, Input, Button } from 'semantic-ui-react'
import { UnitsMeasure } from 'models/question'

type Props = {
    type: UnitsMeasure
    answer: AnswerModel
    members: MemberModel[]
    units: string
    onAdd: (answer: AnswerModel) => void
}

type State = {
    currentAnswer: AnswerModel
}

const answered = (answer: AnswerModel) => answer.answer !== undefined
const authorName = (members: MemberModel[], key: string) => (members.find(x => x.key === key) as MemberModel).name

class Answer extends React.Component<Props, State> {
    state: State = { currentAnswer: { ...this.props.answer } }
    public render() {
        const { answer, members, units, type } = this.props
        const { currentAnswer } = this.state
        return (
            <>
                <List.Item>
                    <List.Content>
                        <List.Description>
                            {!answered(answer)
                                ? <>
                                    <AnswerInput
                                        onChange={this.onChange('answer')}
                                        onKeyPress={this.onKeyPress('Enter', this.onSave)}
                                        type={type}
                                        label={<Label size='large'>{authorName(members, answer.author)}</Label>}
                                        button={<Button color='teal' labelPosition='right' icon='check' content='Save' onClick={this.onSave} />}
                                    >
                                        {units !== '' && units !== undefined
                                            ? <Label basic size='large'>{units}</Label>
                                            : null
                                        }
                                    </AnswerInput>
                                </>
                                : <Container text fluid>
                                    <Label color='green' size='large'>{authorName(members, answer.author)}</Label>  answered
                                </Container>
                            }
                        </List.Description>
                    </List.Content>
                </List.Item>
            </>
        )
    }

    private onKeyPress = (expectedKey: string, func: () => void) => (event: React.KeyboardEvent) => {
        if (event.key === expectedKey)
            func()
    }

    private onSave = () => {
        this.props.onAdd(this.state.currentAnswer)
    }

    private handleChange = (field: keyof AnswerModel) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, currentAnswer: { ...this.state.currentAnswer, [field]: event.target.value } })
    }

    private onChange = (field: keyof AnswerModel) => (value: number) => {
        this.setState({ ...this.state, currentAnswer: { ...this.state.currentAnswer, [field]: value } })
    }
}

export default Answer
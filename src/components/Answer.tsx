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

const showInput = (answer: AnswerModel) => (answer.answer === undefined || answer.answer === null) && answer.shouldAnswer
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
                            {showInput(answer)
                                ? <>
                                    <AnswerInput
                                        onChange={this.onChange('answer')}
                                        onKeyPress={this.onKeyPress('Enter', this.onSave)}
                                        type={type}
                                        label={<Label size='large'>{authorName(members, answer.author)}</Label>}
                                        button={
                                            <Button.Group>
                                                <Button content='Exclude' onClick={this.onExclude} />
                                                <Button.Or text='or' />
                                                <Button color='teal' labelPosition='right' icon='check' content='Save' onClick={this.onSave} />
                                            </Button.Group>}
                                    >
                                        {units !== '' && units !== undefined
                                            ? <Label basic size='large'>{units}</Label>
                                            : null
                                        }
                                    </AnswerInput>
                                </>
                                : answer.shouldAnswer
                                    ? <Container text fluid>
                                        <Label color='green' size='large'>{authorName(members, answer.author)}</Label>  answered
                                </Container>
                                    : <Container text fluid>
                                        <Label color='grey' size='large'>{authorName(members, answer.author)}</Label>  will not answer today
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

    private onExclude = () => {
        this.props.onAdd({ ...this.state.currentAnswer, shouldAnswer: false })
    }

    private onSave = () => {
        console.log(this.state.currentAnswer)
        this.props.onAdd(this.state.currentAnswer)
    }

    private handleChange = (field: keyof AnswerModel) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, currentAnswer: { ...this.state.currentAnswer, [field]: event.target.value } })
    }

    private onChange = (field: keyof AnswerModel) => (value: number) => {
        console.log(value)
        this.setState({ ...this.state, currentAnswer: { ...this.state.currentAnswer, [field]: value } })
    }
}

export default Answer
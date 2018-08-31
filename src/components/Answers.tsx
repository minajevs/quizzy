import * as React from 'react'
import AnswerModel from 'models/answer'
import QuestionModel from 'models/question'
import AnswerComponent from 'components/Answer'

import { Segment, Container, List, Sticky } from 'semantic-ui-react'

type Props = {
  answers: AnswerModel[]
  question: QuestionModel
  onAddAnswer: (answer: AnswerModel) => void
}

class Answers extends React.Component<Props> {
  public render() {
    const { answers, onAddAnswer, question } = this.props
    if (answers.length === 0)
      return (
        <Container>
          <Segment>
            No questions yet
          </Segment>
        </Container>
      )
    return (
        <Container>
          <Segment>
            <Container text={true}>
              {question.text}
            </Container>
            <List divided={true} selection={true} verticalAlign='middle'>
              {answers.map(answer =>
                answer.author === question.author
                  ? null
                  : <AnswerComponent answer={answer} key={answer.key} onAdd={onAddAnswer} />
              )}
            </List>
          </Segment>
        </Container>
    )
  }
}

export default Answers
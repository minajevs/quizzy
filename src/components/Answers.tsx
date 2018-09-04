import * as React from 'react'
import AnswerModel from 'models/answer'
import QuestionModel from 'models/question'
import AnswerComponent from 'components/Answer'
import ViewQuestion from 'components/ViewQuestion'

import * as ReactMarkdown from 'react-markdown'

import { Segment, Container, List, Sticky, Divider } from 'semantic-ui-react'

type Props = {
  answers: AnswerModel[]
  question?: QuestionModel
  onAddAnswer: (answer: AnswerModel) => void
}

class Answers extends React.Component<Props> {
  public render() {
    const { answers, onAddAnswer, question } = this.props
    if (question === undefined)
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
            <Container>
              <ViewQuestion question={question}/>
            </Container>
            <List divided={true} selection={true} verticalAlign='middle'>
              {answers.map(answer =>
                answer.author === question.author
                  ? null
                  : <AnswerComponent answer={answer} units={question.units} key={answer.key} onAdd={onAddAnswer} />
              )}
            </List>
          </Segment>
        </Container>
    )
  }
}

export default Answers
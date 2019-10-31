import * as React from 'react'

import QuestionModel from 'models/question'
import AnswerModel from 'models/answer'

import QuestionComponent from 'components/Question'
import AddQuestionModal from 'components/AddQuestionModal'

import Loading from 'components/Loading'

import { context as questionsContext } from "context/questions"
import { context as answersContext } from "context/answers"

import * as moment from 'moment'

import { Segment, Container, Item, List, Label, Image } from 'semantic-ui-react'

const sortByDate = (a: QuestionModel, b: QuestionModel) => moment(b.date).diff(moment(a.date))

const Questions: React.FC = () => {
  const questionsStore = React.useContext(questionsContext)
  const answersStore = React.useContext(answersContext)

  const { questions } = questionsStore
  if (questions === null)
    return Loading('questions')

  if (questions === null)
    return Loading('answers')

  return (
    <Container>
      <Segment data-test="questions-tab">
        <AddQuestionModal />
        <Item.Group divided={true}>
          {questions
            .sort(sortByDate)
            .map((question, index) =>
              (<QuestionComponent
                question={question}
                key={index} />)
            )}
        </Item.Group>
      </Segment>
    </Container>
  )
}

export default Questions
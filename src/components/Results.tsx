import * as React from 'react'
import ResultModel from 'models/result'
import QuestionModel from 'models/question'

import { Segment, Container } from 'semantic-ui-react'

import ViewQuestion from 'components/ViewQuestion'
import ResultsTable from 'components/ResultsTable'

type Props = {
  question: QuestionModel
  results: ResultModel[]
}

const Results: React.FC<Props> = ({ question, results }) => (
  <Container>
    <Segment>
      <Container>
        <ViewQuestion question={question} />
      </Container>
      <ResultsTable results={results} units={question.unitsMeasure} />
    </Segment>
  </Container>
)

export default Results
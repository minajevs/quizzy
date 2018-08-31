import * as React from 'react'
import ResultModel from 'models/result'
import QuestionModel from 'models/question'
import ResultComponent from 'components/Result'

import { Segment, Container, Item, Table } from 'semantic-ui-react'

type Props = {
  question: QuestionModel
  results: ResultModel[]
}

class Results extends React.Component<Props> {
  public render() {
    const { question, results } = this.props

    return (
      <Container>
        <Segment>
          <Container text={true}>
            {question.text}
          </Container>
          <Container text={true}>
            Answer is: {question.answer}
          </Container>
          <Table basic='very' celled collapsing>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell>Answered</Table.HeaderCell>
                <Table.HeaderCell>Difference</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {results.map((result, index) =>
                <ResultComponent result={result} index={index} key={index} />
              )}
            </Table.Body>
          </Table>
        </Segment>
      </Container>
    )
  }
}

export default Results
import * as React from 'react'
import ResultModel from 'models/result'
import ResultComponent from 'components/ResultRow'

import { Table } from 'semantic-ui-react'

type Props = {
    results: ResultModel[]
}

class ResultsTable extends React.Component<Props> {
    public render() {
        const { results } = this.props

        return (
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
        )
    }
}

export default ResultsTable
import * as React from 'react'
import ResultModel from 'models/result'
import ResultComponent from 'components/ResultRow'

import { Table } from 'semantic-ui-react'
import { UnitsMeasure } from 'models/question'

type Props = {
    units: UnitsMeasure
    results: ResultModel[]
}

const ResultsTable: React.FC<Props> = ({ results, units }) => (
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
                <ResultComponent units={units} result={result} index={index} key={index} />
            )}
        </Table.Body>
    </Table>
)

export default ResultsTable
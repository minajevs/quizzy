import * as React from 'react'

import ResultModel from 'models/result'
import QuestionModel, { UnitsMeasure } from 'models/question'

import * as moment from 'moment'

import { Label, Image, Item, Container, Grid, Input, Icon, Table, Header, SemanticCOLORS } from 'semantic-ui-react'

type Props = {
    units: UnitsMeasure
    result: ResultModel
    index: number
}

const suffix = (num: number) => {
    const j = num % 10
    const k = num % 100
    if (j === 1 && k !== 11) {
        return num + "st"
    }
    if (j === 2 && k !== 12) {
        return num + "nd"
    }
    if (j === 3 && k !== 13) {
        return num + "rd"
    }
    return num + "th"
}

const color = (num: number): SemanticCOLORS => {
    if (num === 1)
        return 'yellow'

    if (num === 2)
        return 'olive'

    if (num === 3)
        return 'brown'

    return 'grey'
}

const cup = (num: number) => num === 1 ? <Icon name='winner' /> : ''

const answer = (ans: number, units: UnitsMeasure) => {
    switch (units) {
        case 'free':
            return ans.toString()
        case 'time':
            return moment(ans).format('HH:mm:ss.SSS')
        case 'date':
            return moment(ans).format('DD-MM-YYYY')
        case 'datetime':
            return moment(ans).format('DD-MM-YYYY HH:mm:ss.SSS')
    }
}
const difference = (stamp: number, units: UnitsMeasure) => {
    switch (units) {
        case 'free':
            return diff.toString()
        case 'time': {
            if (diff(stamp, 'hours') > 0)
                return diff(stamp, 'hours') + ' hour(s)'

            if (diff(stamp, 'minutes') > 0)
                return diff(stamp, 'minutes') + ' minute(s)'

            if (diff(stamp, 'seconds') > 0)
                return diff(stamp, 'seconds') + ' second(s)'

            return diff(stamp, 'milliseconds') + ' ms'
        }
        case 'date': {
            if (diff(stamp, 'years') > 0)
                return diff(stamp, 'years') + ' year(s)'

            if (diff(stamp, 'months') > 0)
                return diff(stamp, 'months') + ' month(s)'

            return diff(stamp, 'days') + ' day(s)'
        }
        case 'datetime':
            if (diff(stamp, 'years') > 0)
                return diff(stamp, 'years') + ' year(s)'

            if (diff(stamp, 'months') > 0)
                return diff(stamp, 'months') + ' month(s)'

            if (diff(stamp, 'days') > 0)
                return diff(stamp, 'days') + ' day(s)'

            if (diff(stamp, 'hours') > 0)
                return diff(stamp, 'hours') + ' hour(s)'

            if (diff(stamp, 'minutes') > 0)
                return diff(stamp, 'minutes') + ' minute(s)'

            if (diff(stamp, 'seconds') > 0)
                return diff(stamp, 'seconds') + ' second(s)'

            return diff(stamp, 'milliseconds') + ' ms'
    }
}

const diff = (stamp: number, unitOfTime: moment.unitOfTime.Diff) => moment(stamp).diff(moment(0), unitOfTime, false)

class ResultRow extends React.Component<Props> {
    public render() {
        const { result, index, units } = this.props
        return (
            <>
                <Table.Row className='question-item'>
                    <Table.Cell size='mini'>
                        <Header as='h4' image>
                            <Image>
                                <Label size='large' circular color={color(index + 1)}>
                                    {!result.isAuthor
                                        ? suffix(index + 1)
                                        : <Icon name='pencil' fitted />
                                    }
                                </Label>
                            </Image>
                            <Header.Content>
                                {cup(index + 1)} {result.member.name}
                                <Header.Subheader>
                                    {result.points} points
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    </Table.Cell>
                    <Table.Cell>
                        {result.answer !== undefined ? answer(result.answer, units) : ''}
                    </Table.Cell>
                    <Table.Cell>
                        {result.difference !== undefined ? difference(result.difference, units) : ''}
                    </Table.Cell>
                </Table.Row>
            </>
        )
    }
}

export default ResultRow
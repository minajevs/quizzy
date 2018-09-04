import * as React from 'react'
import ResultModel from 'models/result'
import { Label, Image, Item, Container, Grid, Input, Icon, Table, Header, SemanticCOLORS } from 'semantic-ui-react'

type Props = {
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

class ResultRow extends React.Component<Props> {
    public render() {
        const { result, index } = this.props
        return (
            <>
                <Table.Row className='question-item'>
                    <Table.Cell size='mini'>
                        <Header as='h4' image>
                            <Image>
                                <Label size='large' circular color={color(index + 1)}>
                                    { !result.isAuthor  
                                        ? suffix(index + 1)
                                        : <Icon name='pencil' fitted/>
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
                        {result.answer !== undefined ? `${result.answer}` : ''}
                    </Table.Cell>
                    <Table.Cell>
                        {result.answer !== undefined ? `${result.difference}` : ''}
                    </Table.Cell>
                </Table.Row>
            </>
        )
    }
}

export default ResultRow
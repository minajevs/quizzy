import * as React from 'react'

import QuestionModel, {UnitsMeasure} from 'models/question'

import * as moment from 'moment'

import * as ReactMarkdown from 'react-markdown'

import { Container, Divider } from 'semantic-ui-react'

type Props = {
    question: QuestionModel
}

const answer = (ans: number | null, units: UnitsMeasure) => {
    if (ans === null || ans === undefined)
        return null

    let answerString = ''

    switch (units) {
        case 'free':
            answerString = ans.toString()
            break
        case 'time':
            answerString = `${diff(ans, 'hours')}:${moment(ans).format('mm:ss.SSS')}`
            break
        case 'date':
            answerString = moment(ans).format('DD:MM:YYYY')
            break
        case 'datetime':
            answerString = moment(ans).format('DD-MM-YYYY HH:mm:ss.SSS')
            break
    }
    return answerString
}

const diff = (stamp: number, unitOfTime: moment.unitOfTime.Diff) => moment(stamp).diff(moment(0), unitOfTime, false)

class ViewQuestion extends React.Component<Props>{
    render() {
        const { question } = this.props
        return (
            <>
                <Container>
                    <ReactMarkdown className='markdown' source={question.description} />
                </Container>
                {question.description !== '' && question.description !== undefined && question.description !== ``
                    ? <Divider />
                    : null
                }
                <Container>
                    {question.text}
                </Container>
                {question.answer !== null && question.answer !== undefined
                    ? <>
                        <label>Answer</label>
                        <Container>
                            {answer(question.answer, question.unitsMeasure)} {question.units !== undefined ? question.units : ''}
                        </Container>
                    </>
                    : null
                }
            </>
        )
    }
}

export default ViewQuestion
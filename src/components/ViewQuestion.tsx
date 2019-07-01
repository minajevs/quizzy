import * as React from 'react'

import QuestionModel, { UnitsMeasure } from 'models/question'

import * as moment from 'moment'

import * as ReactMarkdown from 'react-markdown'

import { Container, Divider } from 'semantic-ui-react'

type Props = {
    question: QuestionModel
}

const diff = (stamp: number, unitOfTime: moment.unitOfTime.Diff) => moment(stamp).diff(moment(0), unitOfTime, false)

const ViewQuestion: React.FC<Props> = ({ question }) => (
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
                    {question.answer.toString()} {question.units !== undefined ? question.units : ''}
                </Container>
            </>
            : null
        }
    </>
)

export default ViewQuestion
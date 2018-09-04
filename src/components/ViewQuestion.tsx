import * as React from 'react'

import QuestionModel from 'models/question'

import * as ReactMarkdown from 'react-markdown'

import { Container, Divider } from 'semantic-ui-react'

type Props = {
    question: QuestionModel
}

class ViewQuestion extends React.Component<Props>{
    render() {
        const { question } = this.props
        return (
            <>
                <Container>
                    <ReactMarkdown className='markdown' source={question.description} />
                </Container>
                {question.description !== '' && question.description !== undefined
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
                            {question.answer} {question.units}
                        </Container>
                    </>
                    : null
                }
            </>
        )
    }
}

export default ViewQuestion
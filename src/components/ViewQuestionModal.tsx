import * as React from 'react'

import AnswerModel from 'models/answer'
import QuestionModel from 'models/question'
import MemberModel from 'models/member'

import ViewQuestion from 'components/ViewQuestion'
import ResultsComponent from 'components/Results'

import getResults from 'api/results'

import { Button, Modal, Icon, Container, Divider } from 'semantic-ui-react'
import ResultsTable from './ResultsTable';

type Props = {
    open: boolean
    onClose: () => void
    onEdit: () => void
    question: QuestionModel
    answers: AnswerModel[]
    members: MemberModel[]
}

class ViewQuestionModal extends React.Component<Props>{
    render() {
        const { open, onClose, onEdit, question, answers, members } = this.props
        let results = null
        if (question.answer !== null && question.answer !== undefined) {
            results = getResults(question, answers, members)
        }
        return (
            <>
                <Modal open={open}>
                    <Modal.Header>View question</Modal.Header>
                    <Modal.Content>
                        <ViewQuestion question={question} />
                        { results !== null
                            ? <ResultsTable results={results} units={question.unitsMeasure}/>
                            : null
                        }
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={onEdit} color='teal'><Icon name='wrench' /> Edit</Button>
                        <Button onClick={onClose}>Close</Button>
                    </Modal.Actions>
                </Modal>
            </>
        )
    }
}

export default ViewQuestionModal
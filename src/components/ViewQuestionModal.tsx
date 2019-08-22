import * as React from 'react'

import AnswerModel from 'models/answer'
import QuestionModel from 'models/question'
import MemberModel from 'models/member'

import ViewQuestion from 'components/ViewQuestion'
import ResultsComponent from 'components/Results'

import getResults from 'api/results'

import { Button, Modal, Icon, Container, Divider } from 'semantic-ui-react'
import ResultsTable from './ResultsTable'

import { context as membersContext } from 'context/members'
import { context as answersContext } from 'context/answers'

type Props = {
    open: boolean
    onClose: () => void
    onEdit: () => void
    question: QuestionModel
}

const ViewQuestionModal: React.FC<Props> = ({ open, onClose, onEdit, question }) => {
    const membersStore = React.useContext(membersContext)
    const answersStore = React.useContext(answersContext)

    const { members } = membersStore
    const answers = answersStore.getAnswers(question.key)

    if (members === null) return <>Members not found!</>

    let results = null
    if (answers !== null && question.answer !== null && question.answer !== undefined) {
        results = getResults(question, answers, members)
    }
    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Modal.Header>View question</Modal.Header>
                <Modal.Content>
                    <ViewQuestion question={question} />
                    {results !== null
                        ? <ResultsTable results={results} units={question.unitsMeasure} />
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

export default ViewQuestionModal
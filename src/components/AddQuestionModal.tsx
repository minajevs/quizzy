import * as React from 'react'
import * as moment from 'moment'

import QuestionModel from 'models/question'
import MemberModel from 'models/member'

import { Button, Icon, Modal, Input, Label, Dropdown, DropdownItemProps, DropdownProps, Divider } from 'semantic-ui-react'

type Props = {
    onAdd: (question: QuestionModel) => void
    teamKey: string
    members: MemberModel[]
}

type State = {
    open: boolean
    question: QuestionModel
}

const createDropDownOptions = (members: MemberModel[]):DropdownItemProps[] => members.map<DropdownItemProps>(member => ({
    text: member.name,
    value: member.key
}))

class AddMemberModal extends React.Component<Props, State>{
    state: State = {open: false, question: {key: '', author: '', authorName: '', answer: null, date: new Date().getTime(), text: '', team: this.props.teamKey}}
    render() {
        const { members } = this.props
        return (
            <>
                <Button icon={true} labelPosition='left' onClick={this.show}>
                    <Icon name='add circle' />
                    Add Question
                </Button>
                <Divider />
                <Modal open={this.state.open}>
                    <Modal.Header>New question</Modal.Header>
                    <Modal.Content>
                        <Dropdown placeholder='Author' selection={true} options={createDropDownOptions(members)} onChange={this.handleDropdown}/>
                        <Input onChange={this.handleChange('text')} fluid={true} label='Text' placeholder='How many beers is enough?' type='text' onKeyPress={this.onKeyPress('Enter', this.add)}/>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button negative onClick={this.cancel}>Cancel</Button>
                        <Button positive onClick={this.add} icon='add' labelPosition='right' content='Add' />
                    </Modal.Actions>
                </Modal>
            </>
        )
    }

    private onKeyPress = (expectedKey: string, func: () => void) => (event: React.KeyboardEvent) => {
        if(event.key === expectedKey)
          func()
      }

    private handleChange = (field: keyof QuestionModel) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({...this.state, question: {...this.state.question, [field]: event.target.value}})
    }

    private handleDropdown = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        this.setState({...this.state, question: {...this.state.question, author: data.value as string}})
    }

    private show = () => {
        this.setState({ open: true, question: {key: '', author: '', authorName: '', answer: null, date: new Date().getTime(), text: '', team: this.props.teamKey}})
    }

    private add = () => {
        this.props.onAdd(this.state.question)
        this.cancel()
    }

    private cancel = () => {
        this.setState({ open: false })
    }
}

export default AddMemberModal
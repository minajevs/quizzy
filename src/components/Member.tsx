import * as React from 'react'
import MemberModel from 'models/member'
import { Label, List, Button, Icon, Image, Container, SemanticCOLORS } from 'semantic-ui-react'
import EditMemberModal from 'components/EditMemberModal'

type Props = {
  member: MemberModel
  index: number
  onSaveMember: (member: MemberModel) => void
}

type State = {
  editing: boolean
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

class Member extends React.Component<Props, State> {
  state: State = { editing: false }
  public render() {
    const { member, index } = this.props
    const { editing } = this.state
    return (
      <>
        <List.Item onClick={this.onRowClick}>
          <Image>
            <Label circular={true} size='big' color={color(index + 1)}>{member.points}</Label>
          </Image>
          <List.Content>
            <List.Description>
              <Container text>{cup(index + 1)} {member.name}</Container>
            </List.Description>
          </List.Content>
        </List.Item>
        <EditMemberModal
          member={member}
          open={editing}
          onClose={this.onModalClose}
          onSave={this.onSave}
        />
      </>
    )
  }

  private onRowClick = () => {
    this.setState({ editing: true })
  }

  private onModalClose = () => {
    this.setState({ editing: false })
  }

  private onSave = (member: MemberModel) => {
    this.props.onSaveMember(member)
    this.setState({ editing: false })
  }
}

export default Member
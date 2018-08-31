import * as React from 'react'
import MemberModel from 'models/member'
import MemberComponent from 'components/Member'
import AddMemberModal from 'components/AddMemberModal'

import { Segment, Container, List, Icon, Sticky, SemanticCOLORS } from 'semantic-ui-react'

type Props = {
  members: MemberModel[]
  teamKey: string
  onAddMember: (member: MemberModel) => void
  onSaveMember: (member: MemberModel) => void
}

class Members extends React.Component<Props> {
  public render() {
    const { members, teamKey, onAddMember, onSaveMember } = this.props
    return (
      <Container>
        <Segment>
          <List divided={true} selection={true} verticalAlign='middle'>
            {members
              .sort(this.sortByRating)
              .map((member, index) =>
              <MemberComponent member={member} index={index} key={member.key} onSaveMember={onSaveMember}/>
            )}
          </List>
          <AddMemberModal onAdd={onAddMember} teamKey={teamKey} />
        </Segment>
      </Container>
    )
  }

  private sortByRating = (a: MemberModel, b: MemberModel) => a.points > b.points ? 0 : 1
}

export default Members
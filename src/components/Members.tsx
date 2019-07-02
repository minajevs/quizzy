import * as React from 'react'
import MemberModel from 'models/member'
import UserModel from 'models/user'
import MemberComponent from 'components/Member'
import AddMemberModal from 'components/AddMemberModal'

import { Segment, Container, List, Icon, Sticky, SemanticCOLORS } from 'semantic-ui-react'

type Props = {
  members: MemberModel[]
  users: UserModel[]
  isAdmin: boolean
  teamKey: string
  onAddMember: (member: MemberModel) => void
  onSaveMember: (member: MemberModel) => void
}

const sortByRating = (a: MemberModel, b: MemberModel) => b.points - a.points
const sortByName = (a: MemberModel, b: MemberModel) => a.name > b.name ? 0 : 1

const Members: React.FC<Props> = props => {
  const { members, teamKey, isAdmin, onAddMember, onSaveMember, users } = props

  const getUserForMember = React.useCallback((member: MemberModel) => users.find(x => x.key === member.user) || null, [users])

  return (
    <Container>
      <Segment>
        <List divided={true} selection={true} verticalAlign='middle'>
          {members
            .sort(sortByName)
            .sort(sortByRating)
            .map((member, index) =>
              <MemberComponent
                member={member}
                user={getUserForMember(member)}
                index={index}
                key={member.key}
                onSaveMember={onSaveMember}
              />
            )}
        </List>
        {isAdmin && <AddMemberModal onAdd={onAddMember} teamKey={teamKey} />}
      </Segment>
    </Container>
  )
}

export default Members
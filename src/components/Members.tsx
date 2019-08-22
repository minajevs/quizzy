import * as React from 'react'
import MemberModel from 'models/member'
import UserModel from 'models/user'
import MemberComponent from 'components/Member'
import AddMemberModal from 'components/AddMemberModal'
import Loading from 'components/Loading'

import { Segment, Container, List, Icon, Sticky, SemanticCOLORS } from 'semantic-ui-react'

import { context as usersContext } from 'context/users'
import { context as membersContext } from 'context/members'
import { context as appContext } from 'context/app'

const sortByRating = (a: MemberModel, b: MemberModel) => b.points - a.points
const sortByName = (a: MemberModel, b: MemberModel) => a.name > b.name ? 0 : 1

const Members: React.FC = props => {
  const usersStore = React.useContext(usersContext)
  const membersStore = React.useContext(membersContext)
  const appStore = React.useContext(appContext)

  const isAdmin = React.useMemo(() => {
    const currentMember = appStore.currentMember()
    return currentMember !== null && currentMember.isAdmin
  }, [appStore.currentMember])

  const getUserForMember = React.useCallback((member: MemberModel) =>
    usersStore.users.find(x => x.key === member.user) || null, [usersStore.users])

  if (membersStore.members === null)
    return Loading('members')

  if (usersStore.users === null)
    return Loading('users')

  return (
    <Container>
      <Segment>
        <List divided={true} selection={true} verticalAlign='middle'>
          {membersStore.members
            .sort(sortByName)
            .sort(sortByRating)
            .map((member, index) =>
              <MemberComponent
                member={member}
                user={getUserForMember(member)}
                index={index}
                key={member.key}
              />
            )}
        </List>
        {isAdmin && <AddMemberModal />}
      </Segment>
    </Container>
  )
}

export default Members
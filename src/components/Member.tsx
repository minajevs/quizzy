import * as React from 'react'
import MemberModel from 'models/member'
import UserModel from 'models/user'
import { Label, List, Button, Icon, Image, Container, SemanticCOLORS } from 'semantic-ui-react'
import EditMemberModal from 'components/EditMemberModal'

import { context as membersContext } from 'context/members'

type Props = {
  member: MemberModel
  user: UserModel | null
  index: number
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

const cup = (num: number) => num === 0 ? <Icon name='winner' /> : ''

const Member: React.FC<Props> = props => {
  const [state, setState] = React.useState<State>({ editing: false })

  const membersStore = React.useContext(membersContext)

  const avatar = React.useMemo(() => (props.user === null
    ? <Image avatar src="https://dummyimage.com/64x64/FFF/000&text=??" />
    : <Image avatar src={props.user.avatarUrl} />), [props.user])

  const onRowClick = React.useCallback(() => {
    setState({ editing: true })
  }, [])

  const onModalClose = React.useCallback(() => {
    setState({ editing: false })
  }, [])

  const onSave = React.useCallback((member: MemberModel) => {
    membersStore.saveMember(member)
    setState({ editing: false })
  }, [membersStore.saveMember])

  return (
    <>
      <List.Item onClick={onRowClick}>
        {avatar}
        <List.Content>
          <div style={{ color: '#000' }}>
            {props.member.name}
            {'   '}
            {cup(props.index)}
          </div>
        </List.Content>
        <List.Content floated="right">
          <Label circular={true} color={color(props.index + 1)} size="large">{props.member.points}</Label>
        </List.Content>
      </List.Item>
      <EditMemberModal
        member={props.member}
        user={props.user}
        open={state.editing}
        onClose={onModalClose}
        onSave={onSave}
      />
    </>
  )
}

export default Member
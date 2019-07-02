import * as React from 'react'
import MemberModel from 'models/member'
import UserModel from 'models/user'
import MembersComponent from 'components/Members'
import Loading from 'components/Loading'

type Props = {
    teamKey: string
    isAdmin: boolean
    members: MemberModel[] | null
    users: UserModel[] | null
    addMember: (member: MemberModel) => Promise<void>
    saveMember: (member: MemberModel) => Promise<void>
}

const Members: React.FC<Props> = props => {
    const { teamKey, members, users } = props

    const addMember = React.useCallback(async (member: MemberModel) => {
        await props.addMember(member)
    }, [props.addMember])

    const saveMember = React.useCallback(async (member: MemberModel) => {
        await props.saveMember(member)
    }, [props.saveMember])

    if (members === null)
        return Loading('members')

    if (users === null)
        return Loading('users')

    return <MembersComponent
        members={members}
        teamKey={teamKey}
        onAddMember={addMember}
        onSaveMember={saveMember} />
}

export default Members
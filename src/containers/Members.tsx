import * as React from 'react'
import MemberModel from 'models/member'
import MembersComponent from 'components/Members'
import Loading from 'components/Loading'

type Props = {
    teamKey: string
    members: MemberModel[] | null
    addMember: (member: MemberModel) => Promise<void>
    saveMember: (member: MemberModel) => Promise<void>
}

const Members: React.FC<Props> = props => {
    const { teamKey, members } = props

    const addMember = React.useCallback(async (member: MemberModel) => {
        await props.addMember(member)
    }, [props.addMember])

    const saveMember = React.useCallback(async (member: MemberModel) => {
        await props.saveMember(member)
    }, [props.saveMember])

    if (members === null)
        return Loading('members')

    return <MembersComponent
        members={members}
        teamKey={teamKey}
        onAddMember={addMember}
        onSaveMember={saveMember} />
}

export default Members
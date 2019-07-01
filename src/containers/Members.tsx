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

class Members extends React.PureComponent<Props> {
    public render() {
        const { teamKey, members, users, isAdmin } = this.props

        if (members === null)
            return Loading('members')

        if (users === null)
            return Loading('users')

        return <MembersComponent 
            members={members} 
            users={users}
            isAdmin={isAdmin}
            teamKey={teamKey}
            onAddMember={this.addMember}
            onSaveMember={this.saveMember}/>
    }

    private addMember = async (member: MemberModel) => {
        await this.props.addMember(member)
    }

    private saveMember = async (member: MemberModel) => {
        await this.props.saveMember(member)
    }
}

export default Members
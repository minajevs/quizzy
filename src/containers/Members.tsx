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

class Members extends React.PureComponent<Props> {
    state = {members: undefined}

    public render() {
        const { teamKey, members } = this.props
        
        if (members === null)
            return Loading('members')

        return <MembersComponent 
            members={members} 
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
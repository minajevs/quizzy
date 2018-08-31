import * as React from 'react'
import MemberModel from 'models/member'
import MembersComponent from 'components/Members'
import Loading from 'components/Loading'

type Props = {
    teamKey: string
    members?: MemberModel[]
    getMembers: () => Promise<void>
    addMember: (member: MemberModel) => Promise<void>
    saveMember: (member: MemberModel) => Promise<void>
}

class Members extends React.Component<Props> {
    constructor(props: Props) {
        super(props)
        this.state = {members: undefined}
        this.loadData()
    }

    public render() {
        const { teamKey, members } = this.props

        // if (members === undefined)
        //    return Loading('members')

        return <MembersComponent 
            members={members || []} 
            teamKey={teamKey}
            onAddMember={this.addMember}
            onSaveMember={this.saveMember}/>
    }

    private loadData = async () => {
        const { getMembers } = this.props
        await getMembers()
    }

    private addMember = async (member: MemberModel) => {
        await this.props.addMember(member)
        this.loadData()
    }

    private saveMember = async (member: MemberModel) => {
        await this.props.saveMember(member)
        this.loadData()
    }
}

export default Members
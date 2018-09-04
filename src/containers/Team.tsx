import * as React from 'react'
import TeamModel from 'models/team'
import TeamComponent from 'components/Team'
import Loading from 'components/Loading'
import TeamNotFound from 'components/TeamNotFound'

type State = {
    team?: TeamModel
}

type Props = {
    loading: boolean
    onAddTeam: (teamKey: string, teamName: string) => void
    teamKey: string
    getTeam: (key: string) => Promise<TeamModel>
    children: React.ReactNode
}

class Team extends React.Component<Props, State> {
    state: State = {}
    constructor(props: Props) {
        super(props)
        this.loadData()
    }

    public render() {
        const { team } = this.state
        const { children, teamKey, onAddTeam, loading } = this.props

        if (team === undefined)
            return Loading('team')

        if (team === null)
            return TeamNotFound(teamKey, onAddTeam)

        return <TeamComponent team={team} loading={loading}>
            {children}
        </TeamComponent>

    }

    private async loadData() {
        const { getTeam, teamKey } = this.props
        const team = await getTeam(teamKey)
        this.setState({team})
    }
}

export default Team
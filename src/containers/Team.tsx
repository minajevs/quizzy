import * as React from 'react'
import TeamModel from 'models/team'
import TeamComponent from 'components/Team'
import Loading from 'components/Loading'
import TeamNotFound from 'components/TeamNotFound'

type Props = {
    loading: boolean
    team: TeamModel | null
    onAddTeam: (teamKey: string, teamName: string) => void
    teamKey: string
    children: React.ReactNode
}

class Team extends React.Component<Props> {
    public render() {
        const { team, children, teamKey, onAddTeam, loading } = this.props

        if (team === null)
            return Loading('team')

        if (team === undefined)
            return TeamNotFound(teamKey, onAddTeam)

        return <TeamComponent team={team} loading={loading}>
            {children}
        </TeamComponent>

    }
}

export default Team
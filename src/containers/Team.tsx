import * as React from 'react'
import TeamModel from 'models/team'
import TeamComponent from 'components/Team'
import Loading from 'components/Loading'
import TeamNotFound from 'components/TeamNotFound'

type Props = {
    loading: boolean
    team: TeamModel | null
    teamNotFound: boolean
    onAddTeam: (teamKey: string, teamName: string) => void
    teamKey: string
    children: React.ReactNode
}

const Team: React.FC<Props> = ({ team, teamNotFound, children, teamKey, onAddTeam, loading }) => {
    if (teamNotFound)
        return TeamNotFound(teamKey, onAddTeam)

    if (team === null)
        return Loading('team')

    return <TeamComponent team={team} loading={loading}>
        {children}
    </TeamComponent>
}

export default Team
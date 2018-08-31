import * as React from 'react'
import TeamModel from 'models/team'
import TeamComponent from 'components/Team'
import Loading from 'components/Loading'

type State = {
    team?: TeamModel
    notFound: boolean
}

type Props = {
    teamKey: string
    getTeam: (key: string) => Promise<TeamModel>
    children: React.ReactNode
}

const error = <div> Can't find that team! Do you want to create it? </div>

class Team extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { notFound: false }
        this.loadData()
    }

    public render() {
        const { team, notFound } = this.state
        const { children } = this.props
        if (notFound)
            return error

        if (team === undefined)
            return Loading('team')

        return <TeamComponent team={team}>
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
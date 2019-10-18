import * as React from 'react'

import { Grid, Container, Button, Header, Loader } from 'semantic-ui-react'

import { useRouter } from 'HookedRouter'
import { context as appContext } from 'context/app'
import { context as usersContext } from 'context/users'
import Team from 'models/team'
import Loading from './Loading'
import { Link } from 'react-router-dom'

const AvailableTeams: React.FC = props => {
    const appStore = React.useContext(appContext)
    const usersStore = React.useContext(usersContext)
    const router = useRouter()
    const [teams, setTeams] = React.useState<Team[] | null>(null)

    const loadTeams = async () => {
        const result = await appStore.availableTeams()

        setTeams(result || [])
    }

    React.useEffect(() => { loadTeams() }, [usersStore.currentUser, router.currentPage])

    if (teams === null)
        return <Loader active inline />

    if (teams.length === 0)
        return <div>No teams</div>

    return <>
        {teams.map(team => (<div key={team.key}>
            <Link to={`/t/${team.key}`}>{team.name}</Link>
        </div>))}
    </>
}

export default AvailableTeams
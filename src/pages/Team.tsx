import * as React from 'react'

import TeamComponent from 'components/Team'
import TeamNotFound from 'components/TeamNotFound'

import { useRouter } from 'HookedRouter'
import { Redirect } from 'react-router'

import { context as usersContext } from 'context/users'
import { context as appContext } from 'context/app'
import { context as membersContext } from 'context/members'
import { context as teamContext } from 'context/team'
import { context as questionsContext } from 'context/questions'
import { context as answersContext } from 'context/answers'

import Loading from 'components/Loading'

const Team: React.FC = props => {
  const usersStore = React.useContext(usersContext)
  const membersStore = React.useContext(membersContext)
  const questionsStore = React.useContext(questionsContext)
  const answersStore = React.useContext(answersContext)
  const appStore = React.useContext(appContext)
  const teamStore = React.useContext(teamContext)

  const [returnEl, derail] = React.useState<React.ReactElement | null>(null)
  const [appLoaded, setAppLoaded] = React.useState<boolean>(false)

  const loadApp = React.useCallback(async (key: string) => {
    if (appLoaded) return
    await appStore.load(key)
    return setAppLoaded(true)
  }, [returnEl])

  const router = useRouter()

  const { teamKey } = router
  const { currentUser } = usersStore
  const { team } = teamStore
  const { members } = membersStore

  React.useEffect(() => {
    // On first open of the team hook up all updates
    teamStore.init()
    membersStore.init()
    questionsStore.init()
    answersStore.init()
  }, [])

  React.useEffect(() => {
    const loadTeam = async () => {
      if (teamKey === null) return derail(<Redirect to="/" />)
      if (currentUser === null) return derail(<Redirect to={`/l/${router.teamKey}`} />)
      await loadApp(teamKey)

      if (teamStore.teamNotFound) return derail(TeamNotFound(router.teamKey!))
      if (team === null) return derail(Loading('team'))
      if (members === null) return derail(Loading('members'))
      const currentMember = appStore.currentMember()

      if (currentMember === null) return derail(<Redirect to="/np" />)

      return derail(<TeamComponent />)
    }

    loadTeam()
  }, [teamKey, currentUser, team, members])

  return returnEl || Loading('team')
}

export default Team
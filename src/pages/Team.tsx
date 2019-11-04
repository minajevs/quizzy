import * as React from 'react'

import Requirements from 'utils/RequirementsFunctor'

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

  const [returnEl, setReturn] = React.useState<React.ReactElement | null>(null)
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
    setReturn(Requirements
      .validateValue(teamKey, <Redirect to="/" />)
      .validate(key => currentUser !== null ? ({ key, user: currentUser }) : null, <Redirect to={`/l/${router.teamKey}`} />)
      .map(({ key }) => loadApp(key))
      .validate(_ => appLoaded ? true : null, Loading('app'))
      .validate(_ => teamStore.teamNotFound ? true : null, TeamNotFound(router.teamKey!))
      .validate(_ => team, Loading('team'))
      .validate(_ => members, Loading('members'))
      .validate(_ => appStore.currentMember(), <Redirect to="/np" />)
      .get(<TeamComponent />))
  }, [teamKey, currentUser, team, members])

  return returnEl || Loading('team')
}

export default Team
import * as React from 'react'

import Requirements from 'utils/RequirementsFunctor'

import { Either, left, right, chain, fold } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'

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

  React.useEffect(() => pipe(
    teamKey !== null ? right(teamKey) : left(<Redirect to="/" />),
    chain(key => currentUser !== null ? right(key) : left(<Redirect to={`/l/${router.teamKey}`} />)),
    chain(key => right(loadApp(key))),
    chain(_ => appLoaded ? right(true) : left(Loading('app'))),
    chain(_ => !teamStore.teamNotFound ? right(true) : left(TeamNotFound(router.teamKey!))),
    chain(_ => team !== null ? right(true) : left(Loading('team'))),
    chain(_ => members !== null ? right(true) : left(Loading('members'))),
    chain(_ => appStore.currentMember() !== null ? right(true) : left(<Redirect to="/np" />)),
    chain(_ => right(<TeamComponent />)),
    fold(setReturn, setReturn)
  ), [teamKey, currentUser, appLoaded, teamStore.teamNotFound, team, members])

  return returnEl || Loading('team')
}

export default Team
import * as React from 'react'

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
import { constVoid } from 'fp-ts/lib/function'

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
    notNull(teamKey, <Redirect to="/" />)(),
    chain(notNull(currentUser, <Redirect to={`/l/${teamKey}`} />)),
    chain(exec(loadApp(teamKey!))),
    chain(isTrue(appLoaded, Loading('app'))),
    chain(isTrue(!teamStore.teamNotFound, TeamNotFound(router.teamKey!))),
    chain(notNull(team, Loading('team'))),
    chain(notNull(members, Loading('members'))),
    chain(notNull(appStore.currentMember(), <Redirect to="/np" />)),
    fold(setReturn, () => setReturn(<TeamComponent />))
  ), [teamKey, currentUser, appLoaded, teamStore.teamNotFound, team, members])

  return returnEl || Loading('team')
}

const notNull = <T, E,>(value: T | null, error: E) => (): Either<E, T> => value !== null ? right(value) : left(error)
const isTrue = <E,>(expr: boolean, error: E) => (): Either<E, void> => expr ? right(constVoid()) : left(error)
const exec = <T,>(f: T) => () => right(constVoid())

export default Team
import * as React from 'react'
import { subscribe } from 'api'

import UserModel from 'models/user'
import { useRouter } from 'HookedRouter'

import { context as usersContext } from 'context/users'
import { context as appContext } from 'context/app'
import { context as teamContext } from 'context/team'
import Loading from 'components/Loading'

type Props = {
    children: React.ReactNode
}

const Auth: React.FC<Props> = props => {
    const usersStore = React.useContext(usersContext)
    const appStore = React.useContext(appContext)
    const [state, setState] = React.useState<UserModel | null>(null)
    const [authenticated, setAuthenticated] = React.useState(false)
    const router = useRouter()

    const currentMember = appStore.currentMember()
    const currentUser = usersStore.currentUser

    const checkAuth = React.useCallback(() => {
        if (state !== null && currentUser === null) {
            // signing out
            router.history.push('/')
            setAuthenticated(false)
        }

        /*
        if (router.teamKey !== null && currentUser !== null && currentMember === null) {
            router.history.push('/np')
            setAuthenticated(false)
        }
        */

        setAuthenticated(true)
    }, [currentMember, currentUser, router.teamKey])

    React.useEffect(() => {
        usersStore.init()
        subscribe('user', user => {
            setState(user)
            checkAuth()
        })
        subscribe('team', team => {
            checkAuth()
        })
    }, [state])

    return authenticated
        ? <>{props.children}</>
        : Loading("application")
}

export default Auth
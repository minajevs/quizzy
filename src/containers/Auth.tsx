import * as React from 'react'
import { subscribe } from 'api'

import UserModel from 'models/user'
import { useRouter } from 'HookedRouter'

import { context as usersContext } from 'context/users'
import { context as appContext } from 'context/app'

type Props = {
    children: React.ReactNode
}

const Auth: React.FC<Props> = props => {
    const usersStore = React.useContext(usersContext)
    const appStore = React.useContext(appContext)
    const [state, setState] = React.useState<UserModel | null>(null)
    const [authenticated, setAuthenticated] = React.useState(false)
    const router = useRouter()

    React.useEffect(() => {
        usersStore.init()
        subscribe('user', user => {
            const currentMember = appStore.currentMember()

            console.log(user, currentMember)

            if (state !== null && user === null) {
                // signing out
                router.history.push('/')
                setAuthenticated(false)
            }

            if (user !== null && currentMember === null) {
                router.history.push('/np')
                setAuthenticated(false)
            }

            setState(user)
            setAuthenticated(true)
        })
    }, [state])

    return authenticated
        ? <>{props.children}</>
        : <>Redirecting...</>
}

export default Auth
import * as React from 'react'
import { subscribe } from 'api'

import UserModel from 'models/user'
import { useRouter } from 'HookedRouter'

import { context as usersContext } from 'context/users'

type Props = {
    children: React.ReactNode
}

const Auth: React.FC<Props> = props => {
    const usersStore = React.useContext(usersContext)
    const [state, setState] = React.useState<UserModel | null>(null)
    const router = useRouter()

    React.useEffect(() => {
        usersStore.init()
        subscribe('user', user => {
            if (state !== null && user === null) {
                // signing out
                router.history.push('/')
            }

            setState(user)
        })
    }, [state])

    return <>{props.children}</>
}

export default Auth
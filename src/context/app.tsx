import * as React from 'react'
import createStoreContext from 'react-concise-state'

import { context as membersContext } from 'context/members'
import { context as usersContext } from 'context/users'
import { context as routerContext } from 'HookedRouter'
import { AppApi } from 'api'

export const [context, Provider] = createStoreContext({
    shouldValidate: false,
}, ({ state, setState, meta, stores }) => ({
    validate: () => setState(prev => ({ ...prev, shouldValidate: true })),
    createTeam: (teamKey: string, teamName: string) => meta.api.createTeam({
        key: teamKey,
        name: teamName
    }),
    logOut: () => meta.api.logOut(),
    currentMember: () => {
        const { currentUser } = stores.users
        const { members } = stores.members

        if (currentUser === null) return null

        const currentMember = members!.find(member => member.user === currentUser.key)

        return currentMember !== undefined ? currentMember : null
    },
    verifyUrlAndLoad: async () => {
        const { router } = stores
        const { api } = meta
        const { teamKey } = router

        // Check if 
        if (teamKey === null || teamKey === undefined || teamKey === '') {
            router.history.push(`/`)
            return false
        }

        if (!api.loggedIn()) {
            router.history.push(`/l/${teamKey}`)
            return false
        }

        await api.load(teamKey)
        return true
    }
}), {
    contexts: { users: usersContext, members: membersContext, router: routerContext },
    meta: { api: AppApi }
}) 
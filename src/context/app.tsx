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
    createTeam: async (teamKey: string, teamName: string) => {
        await meta.api.createTeam({
            key: teamKey,
            name: teamName
        })
    },
    logOut: () => meta.api.logOut(),
    currentMember: () => {
        const { currentUser } = stores.users
        const { members } = stores.members

        if (currentUser === null) return null
        if (members === null) return null

        const currentMember = members.find(member => member.user === currentUser.key)

        return currentMember !== undefined ? currentMember : null
    },
    load: async (teamKey: string): Promise<void> => {
        const { api } = meta
        return await api.load(teamKey)
    }
}), {
    contexts: { users: usersContext, members: membersContext, router: routerContext },
    meta: { api: AppApi }
}) 
import * as React from 'react'
import createStoreContext from 'react-concise-state'

import { context as membersContext } from 'context/members'
import { context as usersContext } from 'context/users'
import { context as routerContext } from 'HookedRouter'
import { AppApi, MembersApi } from 'api'

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
    availableTeams: async () => {
        const { currentUser } = stores.users
        if (currentUser === null) return null

        const teams = await meta.api.getAllTeams()

        if (teams === null || teams === undefined) return null

        const teamMembers = await Promise.all(teams.map(team => meta.membersApi.getTeamMembers(team.key)))

        return teams.filter((team, i) => {
            const members = teamMembers[i]

            if (members === null || members === undefined) return false

            return members.some(member => member.inviteEmail === currentUser.email)
        })
    },
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
    meta: { api: AppApi, membersApi: MembersApi }
}) 
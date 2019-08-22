import * as React from 'react'
import createStoreContext from 'react-concise-state'

import { AppApi, MembersApi, subscribe } from 'api'

import { context as teamContext } from 'context/team'
import { context as membersContext } from 'context/members'
import { context as routerContext } from 'HookedRouter'

import UserModel from 'models/user'

export const [context, Provider] = createStoreContext({
    users: [] as UserModel[],
    currentUser: null as UserModel | null
}, ({ setState, state, meta, stores }) => ({
    init() {
        setState(prev => ({ ...prev, currentUser: meta.api.currentUser() }))

        subscribe('user', user => {
            setState(prev => ({ ...prev, currentUser: user }))
        })
        subscribe('users', this.handleUsersChange)
    },
    handleUsersChange: (users: UserModel[]) => {
        setState(prev => ({ ...prev, users }))
        const { router } = stores
        const { team } = stores.team
        const { members } = stores.members
        const { currentUser } = state

        if (currentUser === null) return
        if (members === null) return

        if (users.find(x => x.key === currentUser.key) === undefined) return

        const userMember = members.find(x => x.inviteEmail === currentUser.email)

        if (userMember !== undefined) {
            meta.membersApi.save({ ...userMember, user: currentUser.key })
        } else if (team !== null) {
            // user is not invited to this team!
            router.history.push('/np')
            return
        }
    }
}), {
    contexts: {
        team: teamContext,
        members: membersContext,
        router: routerContext
    },
    meta: { api: AppApi, membersApi: MembersApi }
}) 
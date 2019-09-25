import * as React from 'react'
import createStoreContext from 'react-concise-state'

import { MembersApi, subscribe } from 'api/index'

import { context as teamContext } from 'context/team'

import MemberModel from 'models/member'

export const [context, Provider] = createStoreContext({
    members: null as MemberModel[] | null,
    initialized: false
}, ({ setState, meta, stores, state }) => ({
    init: () => {
        if (state.initialized) return
        subscribe('members', members => setState(prev => ({ ...prev, members: members && [...members], initialized: true })))
    },
    addMember: async (member: MemberModel) => {
        stores.team.setLoading(true)
        await meta.api.save({ ...member, team: stores.team.team!.key })
        stores.team.setLoading(false)
    },
    saveMember: async (member: MemberModel) => {
        stores.team.setLoading(true)
        await meta.api.save(member)
        stores.team.setLoading(false)
    },
}), {
    contexts: {
        team: teamContext
    },
    meta: { api: MembersApi }
}) 
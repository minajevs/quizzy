import * as React from 'react'
import createStoreContext from 'react-concise-state'

import { MembersApi, subscribe } from 'api/index'

import { context as teamContext } from 'context/team'

import MemberModel from 'models/member'

export const [context, Provider] = createStoreContext({
    members: [] as MemberModel[] | null
}, ({ setState, meta, stores }) => ({
    init: () => {
        subscribe('members', members => setState({ members: members && [...members] }))
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
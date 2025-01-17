import * as React from 'react'
import createStoreContext from 'react-concise-state'

import { AppApi, subscribe } from 'api'

import TeamModel from 'models/team'

import { context as routerContext } from 'HookedRouter'

export const [context, Provider] = createStoreContext({
    loading: false,
    team: null as TeamModel | null,
    teamNotFound: false,
    initialized: false
}, ({ setState, meta, stores, state }) => ({
    init: () => {
        if (state.initialized) return
        subscribe('team', team => setState(prev => ({ ...prev, team, teamNotFound: team === null, initialized: true })))
    },
    createTeam: async (teamKey: string, teamName: string) => {
        await meta.api.createTeam({
            key: teamKey,
            name: teamName
        })

        stores.router.history.push(`/`)
        stores.router.history.push(`t/${teamKey}`)
    },
    setLoading: (loading: boolean) => setState(prev => ({ ...prev, loading }))
}), {
    contexts: { router: routerContext },
    meta: { api: AppApi }
}) 
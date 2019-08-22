import * as React from "react"
import {
    HashRouter,
    Route,
    Link
} from 'react-router-dom'
import { RouteChildrenProps } from "react-router"

type RouterProps = RouteChildrenProps<{}> & {
    teamKey: string | null
}

const RouterContext = React.createContext({} as RouterProps)

export const HookedBrowserRouter: React.FC = ({ children }) => (
    <HashRouter>
        <Route>
            {(routeProps) => {
                const path = routeProps.location.pathname
                const split = path.split('/')
                const teamKey = split[1] === 't' || split[1] === 'l'
                    ? split[2]
                    : null

                console.log(split)
                return (
                    <RouterContext.Provider value={{ ...routeProps, teamKey }}>
                        {children}
                    </RouterContext.Provider>
                )
            }}
        </Route>
    </HashRouter>
)

export function useRouter() {
    return React.useContext(RouterContext);
}

export const context = RouterContext
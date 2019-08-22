import { withRouter, matchPath } from 'react-router-dom'
import { isArray } from 'lodash'
import { compose, mapProps } from 'recompose'

// Lets you pass a param as a string, or an array of params, and you will get
// them as simple props from react-router, instead of drilling down
// match.params.paramName
export default (paramName: string, path: string) =>
    compose(
        withRouter,
        mapProps(({ match, history, location, ...rest }) => {
            const realMatch = path ?
                matchPath(history.location.pathname, {
                    path,
                    exact: false,
                    strict: false,
                }) : match

            if (!realMatch) {
                return { ...rest };
            }

            if (isArray(paramName)) {
                return paramName.reduce(
                    (acc, param) => ({
                        ...acc,
                        [param]: realMatch.params[param],
                    }),
                    { ...rest },
                );
            }
            return { [paramName]: realMatch.params[paramName], ...rest };
        }),
    );
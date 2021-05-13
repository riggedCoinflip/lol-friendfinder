//TODO wrap this with graphql-middleware:
// https://github.com/graphql-compose/graphql-compose-mongoose/issues/158
// https://github.com/maticzav/graphql-middleware

/**
 * wrap graphql resolvers with an authorization check.
 * If the user is not logged in or does not have a role with enough power, throw error (query will not resolve)
 * If authorized, proceed
 * @param {Array.<Object>} resolvers
 * @param {String} role Required role
 * @return {Array.<Object>} resolvers
 */
export default (resolvers, role="admin") => {
    //TODO integrate require-authentication
    Object.keys(resolvers).forEach((k) => {
        resolvers[k] = resolvers[k].wrapResolve(next => async rp => {
            if (rp.context.req.user.role !== role) {
                throw new Error('You do not have the required permissions to view this');
            }
            return next(rp)
        })
    })
    return resolvers
}
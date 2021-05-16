//TODO wrap this with graphql-middleware:
// https://github.com/graphql-compose/graphql-compose-mongoose/issues/158
// https://github.com/maticzav/graphql-middleware

/**
 * wrap graphql resolvers with an authentication check.
 * If the user is not logged in, throw error (query will not resolve)
 * If authenticated, proceed
 * If not, query will not execute and error is shown instead
 * @param resolvers
 * @return resolvers
 */
module.exports = (resolvers) => {
    Object.keys(resolvers).forEach((k) => {
        resolvers[k] = resolvers[k].wrapResolve(next => async rp => {
            if (!rp.context.req.user.isAuth) {
                throw new Error('You must login to view this.');
            }
            return next(rp)
        })
    })
    return resolvers
}
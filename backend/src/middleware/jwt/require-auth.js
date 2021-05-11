//TODO wrap this with graphql-middleware:
// https://github.com/graphql-compose/graphql-compose-mongoose/issues/158
// https://github.com/maticzav/graphql-middleware

export default (resolvers) => {
    Object.keys(resolvers).forEach((k) => {
        resolvers[k] = resolvers[k].wrapResolve(next => async rp => {
            if (!rp.context.req.isAuth) {
                throw new Error('You must login to view this.');
            }
            return next(rp)
        })
    })
    return resolvers
}

// TODO create function isAppLevelAuthorized -> check for app level that contains types like user, mod, superuser
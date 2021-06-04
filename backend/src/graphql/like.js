const {LikeTC} = require("../models/like/like")
const requireAuthentication = require("../middleware/jwt/requireAuthorization");

const swipe = LikeTC.mongooseResolvers.createOne()
    .setDescription("Like or Dislike someone. requester gets automatically set and overrides any value")
    .wrapResolve(next => rp => {
        rp.args.record.requester = rp.context.req.user._id
        return next(rp)
    })

const LikeMutation = {
    ...requireAuthentication({
        swipe,
    }),
}

module.exports = {
    LikeMutation
}
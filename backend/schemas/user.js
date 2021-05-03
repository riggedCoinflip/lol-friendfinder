const {UserTC} = require('../models/user');
const {createUserOneHashPassword, userLogin} = require("../resolvers/user");

const UserQuery = {
    //graphql-compose-mongoose resolvers
    userById: UserTC.getResolver('findById'),
    userByIds: UserTC.getResolver('findByIds'),
    userOne: UserTC.getResolver('findOne'),
    userMany: UserTC.getResolver('findMany'),
    userCount: UserTC.getResolver('count'),
    userConnection: UserTC.getResolver('connection'),
    userPagination: UserTC.getResolver('pagination'),
};

const UserMutation = {
    //graphql-compose-mongoose resolvers
    userCreateOne:  UserTC.getResolver('createOne'),
    userCreateMany: UserTC.getResolver('createMany'),
    userUpdateById: UserTC.getResolver('updateById'),
    userUpdateOne: UserTC.getResolver('updateOne'),
    userUpdateMany: UserTC.getResolver('updateMany'),
    userRemoveById: UserTC.getResolver('removeById'),
    userRemoveOne: UserTC.getResolver('removeOne'),
    userRemoveMany: UserTC.getResolver('removeMany'),
    //custom resolvers
    userCreateOneHashPassword: createUserOneHashPassword,
    userLogin: userLogin,
};





module.exports = {
    UserQuery,
    UserMutation,
};
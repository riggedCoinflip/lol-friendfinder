require('graphql-compose');
const {ProfileTC} = require('../models/profile.model');

const ProfileQuery = {
    profileById: ProfileTC.getResolver('findById'),
    profileByIds: ProfileTC.getResolver('findByIds'),
    profileOne: ProfileTC.getResolver('findOne'),
    profileMany: ProfileTC.getResolver('findMany'),
    profileCount: ProfileTC.getResolver('count'),
    profileConnection: ProfileTC.getResolver('connection'),
    profilePagination: ProfileTC.getResolver('pagination'),
};

const ProfileMutation = {
    profileCreateOne: ProfileTC.getResolver('createOne'),
    profileCreateMany: ProfileTC.getResolver('createMany'),
    profileUpdateById: ProfileTC.getResolver('updateById'),
    profileUpdateOne: ProfileTC.getResolver('updateOne'),
    profileUpdateMany: ProfileTC.getResolver('updateMany'),
    profileRemoveById: ProfileTC.getResolver('removeById'),
    profileRemoveOne: ProfileTC.getResolver('removeOne'),
    profileRemoveMany: ProfileTC.getResolver('removeMany'),
};

module.exports = {
    ProfileQuery,
    ProfileMutation,
};
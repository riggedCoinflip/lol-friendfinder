const mongoose = require('mongoose');
const { composeWithMongoose } = require('graphql-compose-mongoose')
const Schema = mongoose.Schema;

//TODO use real world fields
const profileSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    favourite_color: String,
    some_number: Number,
    some_date: Date,
}, {
    timestamps: true,
});

module.exports = {
    ProfileSchema: mongoose.model('Profile', profileSchema),
    ProfileTC: composeWithMongoose(mongoose.model('Profile', profileSchema)),
}
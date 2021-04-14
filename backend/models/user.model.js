const mongoose = require('mongoose');
const { composeWithMongoose } = require('graphql-compose-mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 16,
    },
    email: String,
}, {
    timestamps: true,
});

module.exports = {
    UserSchema: mongoose.model('User', userSchema),
    UserTC: composeWithMongoose(mongoose.model('User', userSchema)),
}


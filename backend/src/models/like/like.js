const mongoose = require("mongoose");
const idvalidator = require('mongoose-id-validator');
const {composeMongoose} = require("graphql-compose-mongoose");

const LikeSchema = new mongoose.Schema({
    requester: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    recipient: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    status: {
        type: String,
        enums: [
            "liked",
            "disliked",
            //FUTURE: super-liked or something like that
        ],
        required: true
    }
}, {
    timestamps: true
});

LikeSchema.plugin(idvalidator);

LikeSchema.index({requester: 1, recipient: 1}, {unique: true}) //TODO test

const Like = mongoose.model("Match", LikeSchema)
const LikeTC = composeMongoose(Like)

module.exports = {
    Like,
    LikeTC,
}


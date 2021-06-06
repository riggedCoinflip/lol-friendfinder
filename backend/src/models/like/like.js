const mongoose = require("mongoose");
const idvalidator = require('mongoose-id-validator');
const {User} = require("../user/user");
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

//Recipient has to differ from Requester
//TODO test
LikeSchema.pre("validate", function (next) {
    if (this.requester.equals(this.recipient)) {
        this.invalidate("recipient", `Recipient has to differ from Requester "${this.requester}"`, this.recipient)
    }
    next()
})

//TODO test
LikeSchema.post("save", async function (doc, next) {
    // if status==="liked" is saved, see if recipient already liked requester.
    // In this case, add users to each others friends list ♥
    if (
        doc.status === "liked" &&
        await Like.findOne({requester: doc.recipient, recipient: doc.requester, status: doc.status})
    ) {
        await User.updateOne({_id: doc.recipient}, {$push: {friends: {user: doc.requester} }})
        await User.updateOne({_id: doc.requester}, {$push: {friends: {user: doc.recipient} }})
    }
    next()
});

const Like = mongoose.model("Like", LikeSchema)
const LikeTC = composeMongoose(Like)

module.exports = {
    Like,
    LikeTC,
}


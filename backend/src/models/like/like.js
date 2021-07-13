const mongoose = require("mongoose");
const idvalidator = require('mongoose-id-validator');
const {Chat} = require("../chat/chat");
const {User} = require("../user/user");
const {composeMongoose} = require("graphql-compose-mongoose");

const LikeSchema = new mongoose.Schema({
    requester: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    recipient: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
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

LikeSchema.index({requester: 1, recipient: 1}, {unique: true})

LikeSchema.pre("validate", function (next) {
    if (this.requester.equals(this.recipient)) {
        this.invalidate("recipient", `Recipient has to differ from Requester "${this.requester._id}"`, this.recipient)
    }
    next()
})

LikeSchema.post("save", async function (doc, next) {
    // if status==="liked" is saved, see if recipient already liked requester.
    // In this case, add users to each others friends list and create a chat Document ♥
    if (
        doc.status === "liked" &&
        await Like.findOne({requester: doc.recipient, recipient: doc.requester, status: doc.status})
    ) {
        const requester = await User.findOne({_id: doc.requester})
        const recipient = await User.findOne({_id: doc.recipient})

        const chat = new Chat({participants: [requester, recipient]})
        await chat.save()

        requester.friends.push({user: doc.recipient, chat: chat._id})
        recipient.friends.push({user: doc.requester, chat: chat._id})

        await requester.save()
        await recipient.save()
    }
    next()
})

const Like = mongoose.model("Like", LikeSchema)
const LikeTC = composeMongoose(Like)

module.exports = {
    Like,
    LikeTC,
}


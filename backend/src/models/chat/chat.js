const mongoose = require("mongoose")
const {composeMongoose} = require("graphql-compose-mongoose")

const MessageSchema = new mongoose.Schema({
    content: {
        type: String,
        maxlength: 2000
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
}, {
    timestamps: true,
})

const ChatSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    messages: [{
        type: MessageSchema
    }]
}, {
    timestamps: true,
})

const Chat = mongoose.model("Chat", ChatSchema)
const ChatTC = composeMongoose(Chat, {})

module.exports = {
    Chat,
    ChatTC,
}
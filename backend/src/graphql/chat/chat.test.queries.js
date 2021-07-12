const GET_CHAT = `
    query getChat($chatID: MongoID! $page:Int) {
        getChat(chatID: $chatID page: $page) {
            participants
            messages {
                author
                content
                _id
                createdAt
                updatedAt
            }
            _id
            createdAt
            updatedAt
        }
    }
`

const SEND_MESSAGE = `
    mutation sendMessage($chatID: MongoID! $content: String!) {
        sendMessage(chatID: $chatID content: $content)
    }
`

const EDIT_OR_DELETE_MESSAGE = `
    mutation editOrDeleteMessage($chatID: MongoID! $messageID: MongoID! $content: String) {
        editOrDeleteMessage(chatID: $chatID messageID: $messageID content: $content)
    }
`

module.exports = {
    GET_CHAT,
    SEND_MESSAGE,
    EDIT_OR_DELETE_MESSAGE
}
# Chat

## Queries

### getChat

get information of a chat you are participating in.  
You can get the chatID with a ``userSelf`` query

````graphql
{
    getChat(chatID: "validID") {
        participants
        messages {
            content
            author
            createdAt
        }
    }
}
````

## Mutations

### sendMessage

Send a message to a specified chat you are participating in.

````graphql
mutation {
    sendMessage(
        chatID: "validID"
        content: "Hello chat"
    )
}
````

### editOrDeleteMessage

Edit or delete a specified message in a specified chat.  
If content is empty, message is deleted, else, message content is replaced with new content

`````graphql
#edit
mutation {
    editOrDeleteMessage(
        chatID: "validID"
        messageID: "validMessageID"
        content: "New content of message"
    )
}
`````

`````graphql
#delete
mutation {
    editOrDeleteMessage(
        chatID: "validID"
        messageID: "validMessageID"
    )
}
`````

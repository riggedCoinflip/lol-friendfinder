const {dbConnect, dbDisconnectAndWipe} = require("../../utils/test-utils/db-handler")
const createMongoData = require("../../utils/createMongoData")
const {User} = require("../../models/user/user");
const queries = require("./chat.test.queries")
const {mutate, query, login, resetOptions} = require("../../utils/test-utils/graphqlTestClient")
const createMatch = require("../../utils/test-utils/createMatch")

describe("Chat GraphQL Test Suite", () => {
    beforeAll(async () => {
        await dbConnect()
        await createMongoData()
        await createMatch("sktt1faker", "kdaevelynn")
    })
    beforeEach(async () => {
        resetOptions()
    })
    afterAll(async () => dbDisconnectAndWipe())

    it("fails without login", async () => {
        const user = await User.findOne({nameNormalized: "sktt1faker"})
        const chatID = user.friends[0].chat._id

        const noLogin = await mutate(
            queries.GET_CHAT, {
                variables: {
                    chatID
                }
            }
        )
        expect(noLogin.errors[0].message).toStrictEqual("You must login to view this.")
    })

    it("returns chat successfully", async () => {
        await login("faker@skt-t1.gg", "BetterNerfBr0cc0li")
        const user = await User.findOne({nameNormalized: "sktt1faker"})
        const chatID = user.friends[0].chat._id

        const noPagination = await query(
            queries.GET_CHAT, {
                variables: {
                    chatID
                }
            }
        )
        expect(noPagination.errors).toBeUndefined()
        expect(noPagination.data.getChat.participants).toBeDefined()
        expect(noPagination.data.getChat.participants.some(item => user._id.equals(item))).toBe(true)
        expect(noPagination.data.getChat.messages).toBeDefined()
        expect(noPagination.data.getChat._id).toBeDefined()
        expect(noPagination.data.getChat.createdAt).toBeDefined()
        expect(noPagination.data.getChat.updatedAt).toBeDefined()
    })

    it("creates message", async () => {
        await login("faker@skt-t1.gg", "BetterNerfBr0cc0li")
        const user = await User.findOne({nameNormalized: "sktt1faker"})
        const chatID = user.friends[0].chat._id
        const content = "foo"

        const sendMessage = await mutate(
            queries.SEND_MESSAGE, {
                variables: {
                    chatID,
                    content
                }
            })

        expect(sendMessage.errors).toBeUndefined()
        expect(sendMessage.data.sendMessage).toStrictEqual("Message sent successfully!")

        const noPagination = await query(
            queries.GET_CHAT, {
                variables: {
                    chatID
                }
            }
        )

        expect(noPagination.data.getChat.messages[0].content).toStrictEqual(content)
    })

    it("edits message", async () => {
        await login("faker@skt-t1.gg", "BetterNerfBr0cc0li")
        const user = await User.findOne({nameNormalized: "sktt1faker"})
        const chatID = user.friends[0].chat._id
        const content = "xyzzy"

        await mutate(
            queries.SEND_MESSAGE, {
                variables: {
                    chatID,
                    content
                }
            })

        const noPagination = await query(
            queries.GET_CHAT, {
                variables: {
                    chatID
                }
            }
        )

        const messageID = noPagination.data.getChat.messages[0]._id
        const editedContent = "bar"

        const editMessage = await mutate(
            queries.EDIT_OR_DELETE_MESSAGE, {
                variables: {
                    chatID,
                    messageID,
                    content: editedContent
                }
            }
        )

        expect(editMessage.data.editOrDeleteMessage).toStrictEqual("Message edited successfully.")

        const noPagination2 = await query(
            queries.GET_CHAT, {
                variables: {
                    chatID
                }
            }
        )

        expect(noPagination2.data.getChat.messages[0].content).toStrictEqual(editedContent)
    })

    it("deletes message", async () => {
        await login("faker@skt-t1.gg", "BetterNerfBr0cc0li")
        const user = await User.findOne({nameNormalized: "sktt1faker"})
        const chatID = user.friends[0].chat._id
        const content = "foobar"

        await mutate(
            queries.SEND_MESSAGE, {
                variables: {
                    chatID,
                    content: "Message 1"
                }
            })

        await mutate(
            queries.SEND_MESSAGE, {
                variables: {
                    chatID,
                    content
                }
            })

        const noPagination = await query(
            queries.GET_CHAT, {
                variables: {
                    chatID
                }
            }
        )
        const messageID = noPagination.data.getChat.messages[0]._id

        const editMessage = await mutate(
            queries.EDIT_OR_DELETE_MESSAGE, {
                variables: {
                    chatID,
                    messageID,
                }
            }
        )

        expect(editMessage.data.editOrDeleteMessage).toStrictEqual("Message deleted successfully.")

        const noPagination2 = await query(
            queries.GET_CHAT, {
                variables: {
                    chatID
                }
            }
        )

        expect(noPagination2.data.getChat.messages[0]._id).not.toStrictEqual(messageID)
    })

    it("only allows edit or delete of own messages", async () => {
        const user = await User.findOne({nameNormalized: "sktt1faker"})
        const chatID = user.friends[0].chat._id

        await login("faker@skt-t1.gg", "BetterNerfBr0cc0li")
        await mutate(
            queries.SEND_MESSAGE, {
                variables: {
                    chatID,
                    content: "foo"
                }
            })

        const noPagination = await query(
            queries.GET_CHAT, {
                variables: {
                    chatID
                }
            }
        )
        //message of Faker
        const messageID = noPagination.data.getChat.messages[0]._id

        await login("succ@ubus.xxx", "GZGqGE!324342")
        await mutate(
            queries.SEND_MESSAGE, {
                variables: {
                    chatID,
                    content: "bar"
                }
            })

        //still logged in as KDAEvelynn
        const editMessage = await mutate(
            queries.EDIT_OR_DELETE_MESSAGE, {
                variables: {
                    chatID,
                    messageID,
                }
            }
        )

        expect(editMessage.errors[0].message).toStrictEqual("You can only edit or delete your own messages")
    })

    it("allows pagination of messages", async () => {
        //need new, empty chat
        await createMatch("sktt1faker", "alfredo")

        const user = await User.findOne({nameNormalized: "sktt1faker"})
        const chatID = user.friends[1].chat._id

        await login("faker@skt-t1.gg", "BetterNerfBr0cc0li")
        for (let i = 0; i < 50; i++) {
            await mutate(
                queries.SEND_MESSAGE, {
                    variables: {
                        chatID,
                        content: `${i}`
                    }
                })
        }

        //without pagination, show latest message
        const noPagination = await query(
            queries.GET_CHAT, {
                variables: {
                    chatID
                }
            }
        )
        expect(noPagination.data.getChat.messages[0].content).toStrictEqual("49")

        //with pagination, show up to 20 messages
        const page1 = await query(
            queries.GET_CHAT, {
                variables: {
                    chatID,
                    page: 1
                }
            }
        )
        const page1Contents = page1.data.getChat.messages.map(message => message.content)
        expect(page1Contents).toStrictEqual([
            "49", "48", "47", "46", "45", "44", "43", "42", "41", "40",
            "39", "38", "37", "36", "35", "34", "33", "32", "31", "30"
        ])

        const page2 = await query(
            queries.GET_CHAT, {
                variables: {
                    chatID,
                    page: 2
                }
            }
        )
        const page2Contents = page2.data.getChat.messages.map(message => message.content)
        expect(page2Contents).toStrictEqual([
            "29", "28", "27", "26", "25", "24", "23", "22", "21", "20",
            "19", "18", "17", "16", "15", "14", "13", "12", "11", "10"
        ])

        const page3 = await query(
            queries.GET_CHAT, {
                variables: {
                    chatID,
                    page: 3
                }
            }
        )
        const page3Contents = page3.data.getChat.messages.map(message => message.content)
        expect(page3Contents).toStrictEqual([
            "9", "8", "7", "6", "5", "4", "3", "2", "1", "0"
        ])

        const page4 = await query(
            queries.GET_CHAT, {
                variables: {
                    chatID,
                    page: 4
                }
            }
        )
        const page4Contents = page4.data.getChat.messages.map(message => message.content)
        expect(page4Contents).toStrictEqual([])
    }, 30_000)

    it("only allows queries on chats the user is part of", async () => {
        await login("admin@email.com", "AdminPW1")

        const user = await User.findOne({nameNormalized: "sktt1faker"})
        const chatID = user.friends[0].chat._id


        const noPagination = await query(
            queries.GET_CHAT, {
                variables: {
                    chatID
                }
            }
        )

        expect(noPagination.errors[0].message).toStrictEqual("chatID does not exist or you are not participant of that chat")
    })
})
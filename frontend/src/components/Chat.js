import { useContext, useEffect, useState, React } from "react"
import { SEND_MESSAGE } from "../GraphQL/Mutations"
import { useApolloClient } from "@apollo/client"
import { AuthContext } from "../App"
import { Headers } from "../constants"

import FriendList from "./FriendList"
import ChatMessage from "./ChatMessage"
import { Button } from "react-bootstrap"
import AvatarImage from "./AvatarImage"

export default function Chat() {
  const client = useApolloClient()

  const { token, state, setState, refetch } = useContext(AuthContext)

  const [userID, setUserID] = useState("UserId!")
  const [selectedChatID, setSelectedChatID] = useState()
  const [userNameChat, setUserNameChat] = useState("My clone")
  const [chatAvatar, setChatAvatar] = useState()
  // const [selected, setSelected] = useState()

  const [typedMessage, setContentMessage] = useState()
  const [errored, setErrored] = useState(false)

  const [searchUser, setSearchUser] = useState("")

  useEffect(() => {
    if (!state) {
      refetch()
      console.log("We refetch", state)
    }
  }, [])

  useEffect(() => {
    //Find a specific friend using the given userID and return his or her chat
    setSelectedChatID(
      state?.friends?.find((item) => item?.user === userID)?.chat
    )
    console.log("Another user selected. ChatID", selectedChatID)
    console.log("selected UserID", userID)
    document.getElementById("user-search").value = ""
  }, [userID])

  function sendMessage(chatID, content) {
    return client.mutate({
      context: Headers(token),
      mutation: SEND_MESSAGE,
      variables: {
        chatID: selectedChatID,
        content: typedMessage,
      },
    })
  }

  const sendTheMessageNow = () => {
    //   e.preventDefault()
    sendMessage(selectedChatID, typedMessage)
      .then((res) => {
        console.log("chatID: ", selectedChatID)
        console.log("contentMessage: ", typedMessage)
        console.log("response: ", res?.data?.sendMessage)
        setContentMessage("")
        refetch()
      })
      .catch((err) => {
        setErrored(true)
        console.error(`Error in SendMessage: ${err}`)
      })
  }

  const messageHandler = (e) => {
    e.persist()
    setContentMessage(e.target.value)
    console.log(typedMessage)
    console.log("chatID", selectedChatID)
  }

  return !token ? (
    <div key="Not-logged">You are NOT logged in</div>
  ) : (
    <>
      <div className="chat-container padding5">
        <div className="chat-left-column">
          <input
            className="user-search"
            autoFocus
            type="text"
            placeholder="I am looking for 🔍"
            id="user-search"
            name="user-search"
            onChange={(e) => {
              console.log("typing", e.target.value)
              setSearchUser(e.target.value)

              //Setting a different image as background
              /* const imgUrl = `url(${e.target.value})`

              document.getElementById("chat-room").style.backgroundImage =
                imgUrl*/
            }}
          />
          <div className="user-many">
            {state?.friends &&
              state?.friends?.map((item, index) => {
                return (
                  <FriendList
                    setUserID={setUserID}
                    setUserNameChat={setUserNameChat}
                    setChatAvatar={setChatAvatar}
                    userId={item.user}
                    searchUser={searchUser}
                    setSearchUser={setSearchUser}
                    key={index + 1}
                  />
                )
              })}
          </div>
        </div>

        <div className="chat-room" id="chat-room">
          <div className="user-info">
            {userNameChat}
            <AvatarImage avatarUrl={chatAvatar} name={userNameChat} />
          </div>

          <div className="conversation">
            {/*From all my friends, show the messages between me and the selected user*/}

            {state?.friends &&
              state?.friends
                ?.filter((item) => {
                  return item.user === userID
                })
                .map((item) => {
                  return (
                    <>
                      <ChatMessage chatID={item.chat} />
                    </>
                  )
                })}

            <br />
          </div>
          {/*Do we nedd a element for the input? */}

          <div className="message-field">
            {" "}
            <input
              value={typedMessage}
              id="contentMessage"
              name="contentMessage"
              type="text"
              className="message-text"
              placeholder="Something good to say?"
              onChange={messageHandler}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  sendTheMessageNow()
                }
              }}
            />
            <Button
              className="send-button"
              variant="primary"
              size="sm"
              onClick={sendTheMessageNow}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

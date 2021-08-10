import { useContext, useEffect, useState, React } from "react"
import { SEND_MESSAGE } from "../GraphQL/Mutations"
import { useApolloClient } from "@apollo/client"
import { AuthContext } from "../App"
import { Headers } from "../constants"

import FriendList from "./FriendList"
import ChatMessage from "./ChatMessage"
import {  Button} from "react-bootstrap"
import AvatarImage from "./AvatarImage"

export default function Chat({}) {
  const client = useApolloClient()

  const { token, state, setState, refetch } = useContext(AuthContext)

  const [userID, setUserID] = useState("UserId!")
  const [chatID, setChatID] = useState("-")
  const [userNameChat, setUserNameChat] = useState("My clone")
  const [chatAvatar, setChatAvatar] = useState()
  const [selected, setSelected] = useState()

  const [contentMessage, setContentMessage] = useState()
  const [errored, setErrored] = useState(false)

  const [searchUser, setSearchUser] = useState("")


  useEffect(() => {
    if (!state) {
      refetch()
      console.log("We refetch", state)
    }
  }, [])

  /*

  const [sendMessage, { data: dataMessage }] = useMutation(
    SEND_MESSAGE,
    ContextHeader(token)
  )
*/
  function sendMessage(chatID, content) {
    return client.mutate({
      context: Headers(token),
      mutation: SEND_MESSAGE,
      variables: {
        chatID: chatID,
        content: contentMessage,
      },
    })
  }

  const sendTheMessageNow = (e) => {
    e.preventDefault()

    sendMessage(chatID, contentMessage)
      .then((res) => {
        console.log("chatID: ", chatID)
        console.log("contentMessage: ", contentMessage)

        console.log("response: ", res?.data?.sendMessage)
        setContentMessage("")
        refetch()
      })
      .catch((err) => {
        setErrored(true)
        console.error(`Error in SendMessage: ${err}`)
      })
    /*
    //    setChatID(item.chat)
    console.log("contentMessage: ", contentMessage)
    console.log("chatID ", chatID)
    sendMessage({
      variables: {
        chatID: chatID,
        content: contentMessage,
      },
    }).catch(() => {
      setErrored(true)
    })
    
    .then((res) => { 
      console.log("Msg sent successfully", res)
    })
    
    setContentMessage("")*/
  }

  const messageHandler = (e) => {
    e.preventDefault()
    e.persist() //important
    setContentMessage(e.target.value)
    console.log(contentMessage)
    console.log("chatID", chatID)
  }

  return !token ? (
    <div>You are NOT logged in</div>
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
          <div className="chat-users">
            {state?.friends &&
              state?.friends
              ?.map((item, index) => {
                return (
                  <FriendList
                    setUserID={setUserID}
                    setUserNameChat={setUserNameChat}
                    setChatAvatar={setChatAvatar}
                    userId={item.user}
                    searchUser={searchUser}
                  />
                )})
              }
          </div>
        </div>

        <div className="chat-room" id="chat-room">
          <div className="user-info">
            {userNameChat}
            <AvatarImage avatarUrl={chatAvatar} name={userNameChat} />
            <br />
            UserID: {userID}
          </div>

          <div className="conversation">
            {/*Find the conversation for selected user/friend*/}
            {state?.friends &&
              state?.friends
                ?.filter((item) => {
                  return item.user === userID
                })
                .map((item) => {
                  return (
                    <>
                      <br />
                      ChatID: {item.chat}
                      <br />
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
              value={contentMessage}
              id="contentMessage"
              onChange={messageHandler}
              name="contentMessage"
              type="text"
              className="message-text"
              placeholder="Something good to say?"
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

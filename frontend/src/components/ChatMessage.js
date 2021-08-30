import { useState, useContext, React } from "react"
import { useApolloClient } from "@apollo/client"
import { GET_CHAT } from "../GraphQL/Queries"
import { GlobalContext } from "../App"
import { Headers } from "../constants"

export default function ChatMessage({ chatID }) {
  const client = useApolloClient()

  const { token, state } = useContext(GlobalContext)
  const [conversation, setConversation] = useState()
  // const [conversation2, setConversation2] = useState()

  const [participants, setParticipants] = useState()

  function GetMessage(chatID) {
    return client.query({
      context: Headers(token),
      query: GET_CHAT,
      variables: { chatID, page: 1 },
    })
  }

  GetMessage(chatID).then((res) => {
    //  console.log("GetConversation", res)
    setConversation(res?.data?.getChat?.messages)
    console.log("Conversation(State)", conversation)
  }).catch((err) => {
    console.error(`Error in GetMessage: ${err}`)
  })

  // differ between my and message from other users
  //let isSentByCurrentUser = false;

  // const messageContainer = document.getElementById('oneMsg')
  function limitLength(input, start, end) {
    const output = input?.slice(start, end) ?? " "
    return output
  }
  return (
    <>
      {conversation &&
        conversation
          .slice(0) //with slice(0), we make a copy of the conversation, because this is only-read
          .reverse() //order of the conversation will be inverted with reverse()
          .map((msg) => {
          return msg.author === state._id ? 
          //Justify the messages, depending if this comes from you or from other user
          (
              <div
                key={msg?._id}
                id="oneMsg"
                className="message-container-others"
              >
                <div>
                  <p> {msg?.content} </p>
                </div>
                <p className="createdAt padding5">
                  {limitLength(`${msg?.createdAt}`, 11, 16)}
                </p>
              </div>
            ) : (
              <div key={msg?._id} id="oneMsg" className="message-container-me">
                <div>
                  <p> {msg?.content}</p>
                </div>
                <p className="createdAt padding5">
                  {limitLength(`${msg?.createdAt}`, 11, 16)}
                </p>
              </div>
            )
          })}
    </>
  )
}

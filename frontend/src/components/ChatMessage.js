import { useState, useContext, React } from "react"
import { useApolloClient } from "@apollo/client"
import { GET_CHAT } from "../GraphQL/Queries"
import { AuthContext } from "../App"
import { Headers } from "../constants"

export default function ChatMessage({ chatID }) {
  const client = useApolloClient()

  /*
  useEffect(() => {
    if (conversation) 
    console.log("useEffect")  
  }, [])
*/

  const { token } = useContext(AuthContext)
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
    //console.log("Conversation(State)", conversation)
  })

  //to order the messages in the right way
  /*
  function orderC(conversation) {
    setConversation2(Object.assign([], conversation).reverse())
    //setConversation(CInverted)
    console.log("CInverted(State)", conversation2)
    console.log("CInverted(State)", typeof conversation2)
  }
  orderC(conversation)
*/
  // differ between my and message from other users
  //let isSentByCurrentUser = false;

  // const messageContainer = document.getElementById('oneMsg')

  return (
    <>
      {conversation &&
        conversation
          .slice(0) //with slice(0), we make a copy of the conversation, because this is only-read
          .reverse() //order of the conversation will be inverted with reverse()
          .map((msg) => {
            /*
          if(conversation?.author === state._id){
         messageContainer.style.justifyContent = 'flex-start'
         messageContainer.style.color = 'red'         
        }
         */

            return (
              <div key={msg?._id} id="oneMsg justifyEnd">
                <div className="messageContainer justifyEnd">
                  {/*  <p >{msg?.author}</p> */}
                  <div className="">
                    <p> {msg?.content}/</p>
                  </div>
                  <p> {msg?.createdAt}</p>
                </div>
              </div>
            )
          })}
    </>
  )
}

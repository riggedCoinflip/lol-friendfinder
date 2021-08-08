import { useState, useEffect, useContext, React } from "react"

import { useQuery, useApolloClient } from "@apollo/client"
import { GET_CHAT } from "../GraphQL/Queries"
import { AuthContext } from "../App"

import { ContextHeader } from "../constants"
import { Card, Image, Row, Button, Col } from "react-bootstrap"

export default function ChatMessage({ chatID }) {
  const client = useApolloClient()

  const { token, state, setState, refetch } = useContext(AuthContext)
  console.log("chatID ", chatID)

     const { loading, error, data: dataChat, } = useQuery(
    GET_CHAT,
    ContextHeader(token),
    { variables: { chatID, page: 1 } }, 
    
  )
  if (loading) return "No error, loading";
//If the error is deleted I can receive the data...


//  if (error) return `Error! ${error} `;
  if (dataChat) return "Data is there";
  console.log("dataChat ", dataChat)

  /*
  

  function Submit(chatID) {
    return client.query({
      context: ContextHeader(token),
      query: GET_CHAT,
      variables: { chatID, page :1 }, 
    })
  }
  Submit(chatID).then((res) => {
    console.log(res)
    alert(res)
  })
*/

  return (
    <>
      <Row>
        <div id="div1">
          {/*console.log("dataChat: ", dataChat.getChat.messages.content)*/}
          No problem here
          {token}
        </div>
      </Row>
    </>
  )
}

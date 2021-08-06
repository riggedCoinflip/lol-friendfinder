import { useState, useEffect, useContext, React } from "react"

import { useQuery, useApolloClient } from "@apollo/client"
import { GET_CHAT } from "../GraphQL/Queries"

import { ContextHeader } from "../constants"
import { Card, Image, Row, Button, Col } from "react-bootstrap"
import { AuthContext } from "../App"


export default function ChatMessage({ chatID }) {
  const client = useApolloClient()

  const { token, state, setState, refetch } = useContext(AuthContext)
  console.log("chatID ", chatID)
 

  const { loading, error, data: dataChat } = useQuery(
    GET_CHAT,
   ContextHeader(token),
    //{ pollInterval: 100 },
    {variables: { chatID, page: 1 },
    })

  if (loading) return "loading"
  if (error) return (`Error! ${error} `)
 if(dataChat) return  "Data is there"
  
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

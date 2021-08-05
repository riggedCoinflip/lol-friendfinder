import { useQuery, gql, useApolloClient } from "@apollo/client"
import { useState, useContext, React } from "react"
//import { GET_CHAT } from "../GraphQL/Queries"

import { ContextHeader } from "../constants"
import { Card, Image, Row, Button, Col } from "react-bootstrap"
import { AuthContext } from "../App"

const GET_CHAT = gql`
  query GET_CHAT($chatID: MongoID!) {
    getChat(chatID: $chatID) {
      participants
      messages {
        content
        author
        createdAt
      }
    }
  }
`
export default function ChatMessage({ chatID }) {
  const client = useApolloClient()

  const { token, state, setState, refetch } = useContext(AuthContext)
  console.log("chatID ", chatID)
  /*
  const { loading, error, data: dataChat } = 
  useQuery(GET_CHAT, ContextHeader(token),{
    variables: { chatID },
  })
  */

  const { loading, error, data: dataChat } = useQuery(
    GET_CHAT,
    ContextHeader(token),
    { pollInterval: 100 },{
      variables: { chatID },
    })

  if (loading) return null
  if (error) return `Error! ${error}`
 if(dataChat) return  "Data is there"
  
/*
  Submit(chatID).then((res) => {
    console.log(res)
  })

  function Submit(chatID) {
    return client.query({
      query: GET_CHAT,
      variables: { chatID },
      context: ContextHeader(token),
      
    })
  }
*/
  return (
    <>
      <Row>
        <div id="div1">
          {/*data.getChat.messages.content*/}
          No problem here
        </div>
      </Row>
    </>
  )
}

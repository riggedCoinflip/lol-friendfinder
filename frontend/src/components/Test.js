import { React, useContext } from "react"

import { useQuery, gql } from "@apollo/client"
import { ContextHeader } from "../constants"
import { AuthContext } from "../App"

const GET_CHAT = gql`
  query GET_CHAT($chatID: MongoID!, $page: Int) {
    getChat(chatID: $chatID, page: $page) {
      participants
      messages {
        content
        author
        createdAt
      }
    }
  }
`

var chatID = ""

export default function Test() {
  const { token } = useContext(AuthContext)

  const { loading, error, data } = useQuery(GET_CHAT, {
      context: {
        headers: {
          "x-auth-token": token,
        },
              }},
  { pollInterval: 100 }, {
    variables: { chatID, page: 0 },
  })

  if (loading) return null
  if (error) return `Error! ${error}`

  console.log(data)
  return (
    <>
      <div>hola?</div>
    </>
  )
}

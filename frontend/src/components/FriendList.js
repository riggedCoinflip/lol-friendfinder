import { useState, useEffect, React } from "react"
import { GET_USER_BY_ID } from "../GraphQL/Queries"
import { SEND_MESSAGE } from "../GraphQL/Mutations"
import { useHistory } from "react-router-dom"

import { useQuery, useMutation } from "@apollo/client"
import { ContextHeader } from "../constants"
import { Card, Image, Row, Button, Col } from "react-bootstrap"
import AvatarImage from "./AvatarImage"

export default function FriendList({
  userId,
  setUserID,
  setUserNameChat,
  setChatAvatar,
}) {
  const history = useHistory()

  const { loading, error, data } = useQuery(GET_USER_BY_ID, {
    variables: { userId },
  })

  if (loading) return null
  if (error) return `Error! ${error}`

  return (
    <>
      <Row>
        <div
          className="flex-row"
          id="div1"
          onClick={(e) => {
            e.preventDefault()
            //alert(data.userOneById._id)
            setUserID(data.userOneById._id)
            setUserNameChat(data.userOneById.name)
            setChatAvatar(data.userOneById.avatar)
          }}
        >
          <div id="div2" key={data.userOneById._id}>
            {data.userOneById.name}

            <AvatarImage
              avatarUrl={data.userOneById.avatar}
              name={data.userOneById.name}
            />

          </div>
        </div>
      </Row>
    </>
  )
}

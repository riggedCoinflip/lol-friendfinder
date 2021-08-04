import { useState, useEffect, React } from "react"
import { GET_USER_BY_ID } from "../GraphQL/Queries"
import { SEND_MESSAGE } from "../GraphQL/Mutations"
import { useHistory } from "react-router-dom"

import { useQuery, useMutation } from "@apollo/client"
import { ContextHeader } from "../constants"
import { Card, Image, Row, Button, Col } from "react-bootstrap"

export default function FriendList({
  userId,
  friendship,
  setTextWith,
  setChatWith,
}) {
  const history = useHistory()

  const { loading, error, data } = useQuery(GET_USER_BY_ID, {
    variables: { userId },
  })

  if (loading) return null
  if (error) return `Error! ${error}`

  //Show age if this is setted up
 

  const start_chat = (userId) => {
    setTextWith(userId)
  }

  return (
    <>
      <Row           
>
        <div
        className="flex-row"
          id="div1"
          onClick={(e) => {
            e.preventDefault()
            //alert(data.userOneById._id)
            setChatWith(data.userOneById._id)
          }}
        >
          <div id="div2"  key={data.userOneById._id} >
            {data.userOneById.name}

            {data.userOneById.avatar ? (
              <Image
                src={data.userOneById.avatar}
                alt="Picture not defined"
                className="dot-mini"
              />
            ) : (
              <div className="dot">
                <div className="center-me">
                  {data.userOneById.name.slice(0, 2)}
                </div>
              </div>
            )}

          </div>
        </div>
      </Row>
    </>
  )
}

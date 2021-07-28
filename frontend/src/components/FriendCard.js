import { useState, useEffect, React } from "react"
import { GET_USER_BY_ID } from "../GraphQL/Queries"
import { useQuery } from "@apollo/client"
import { ContextHeader } from "../constants"
import { Card, Image, Row, Button, Col } from "react-bootstrap"

export default function FriendCard({ userId, friendship }) {
  const { loading, error, data } = useQuery(GET_USER_BY_ID, {
    variables: { userId },
  })

  if (loading) return null
  if (error) return `Error! ${error}`

  //Show age if this is setted up
  function showAge(age) {
    if (age >= 0) return age
    else return "??"
  }

  return (
    <div className="flex-container">
      <Card
        key={data.userOneById._id}
        style={{ width: "18rem" }}
      >
        {data.userOneById.name}

        {data.userOneById.avatar ? (
          <Image
            src={data.userOneById.avatar}
            alt="Picture not defined"
            className="dot"
          />
        ) : (
          <div className="dot">
            <div className="letter">{data.userOneById.name.slice(0, 2)}</div>
          </div>
        )}

        {showAge(data.userOneById?.age)}
        {friendship && (
          <Button
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.preventDefault()
              //start chat
            }}
          >
            Say hi
          </Button>
        )}
      </Card>
    </div>
  )
}

import { useState, useEffect, React } from "react"
import { GET_USER_BY_ID } from "../GraphQL/Queries"
import { useQuery } from "@apollo/client"
import { ContextHeader } from "../constants"
import { Card, Image } from "react-bootstrap"

export default function FriendCard({ userId }) {
  const { loading, error, data } = useQuery(GET_USER_BY_ID, {
    variables: { userId },
  })

  if (loading) return null
  if (error) return `Error! ${error}`

  return (
    <>
      <Card>
      {data.userOneById.name}<br />
      
         <Image src={data.userOneById.avatar}
          style={{ height: 200, width: 200 }} />
        
        {data.userOneById?.age}
        
      </Card>
    </>
  )
}

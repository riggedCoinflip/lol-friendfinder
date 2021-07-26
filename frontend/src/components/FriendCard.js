import { useState, useEffect, React } from "react"
import { GET_USER_BY_ID } from "../GraphQL/Queries"
import { useQuery } from "@apollo/client"
import { ContextHeader } from "../constants"
import { Card } from "react-bootstrap"

export default function FriendCard( propFriends ) {
  const [friendCard, setFriendCard] = useState()

  console.log("UserId: ", propFriends?.userId)
  
 
  const {  data, loading, error } = useQuery(
    GET_USER_BY_ID, 
    { 
      variables:  {userId: propFriends?.userId }, 
    } 
  )

  /*
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error, friendCard?</p>
  */
  console.log("Name of the User: ", data)
  /*
  useEffect(() => {
    setFriendCard(data)
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error, FriendCard ?</p>
*/
  return (
    <div className="FriendCard">
      <strong>Info is comming---</strong>
      <Card horizontal>
        <Card name="friends" variant="success" key={propFriends}>
        UserId:  {propFriends?.userId}
        <br />

        Name:
        </Card>
      </Card>
    </div>
  )
}

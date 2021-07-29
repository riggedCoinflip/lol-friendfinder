import { useContext, useState, useEffect, React } from "react"
import { GET_MY_INFO, GET_USER_BY_ID } from "../GraphQL/Queries"
import { useQuery } from "@apollo/client"
import { ContextHeader } from "../constants"
import { ListGroup, Row, Card, Col } from "react-bootstrap"
import FriendCard from "./FriendCard"
import { AuthContext } from "../App"

export default function Friends({profileInfo}) {
  const { token } = useContext(AuthContext)
  const [friends, setFriends] = useState()
  const [blocked, setBlocked] = useState()

 const [amigos, setAmigos] = useState(profileInfo)

  const { loading, error, data, refetch } = useQuery(
    GET_MY_INFO,
    ContextHeader(token),
    { pollInterval: 1000 }
  )
 
  useEffect(() => {
    setFriends(data?.userSelf?.friends)
    setBlocked(data?.userSelf?.blocked)
    
    console.log("profileInfo ", profileInfo)
    /*
    setAmigos(profileInfo)
    console.log("amigos ", amigos)*/
  }, [])

  useEffect(() => {
    if (data?.userSelf?.friends || !friends || !blocked) {
      refetch()
      setFriends(data?.userSelf?.friends)
      setBlocked(data?.userSelf?.blocked)
     /* setAmigos({profileInfo})
      console.log("amigos ", profileInfo)*/

      console.log("friends", friends)
      console.log("blocked", blocked)
    }
  }, [friends, blocked])

  //console.log("freiends", friends)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error, where are your friends?</p>
  /*
  useEffect(() => {
    if (!friends) {
      setFriends(props?.data?.userSelf.friends)
    }
  }, [friends])

  TO SHOW THE USERS BY ID; CHECK IN LOGIN HOW THE QUERY WAS CALLED;LINE 33-41
*/

  return !token ? (
    <div>You are NOT logged in</div>
  ) : (
    <div className="friends padding">

<Card.Title>My friends(props or useContext)</Card.Title>
      <Row>
        {amigos &&
          amigos?.map((item, index) => {
            return (
              <>
                <FriendCard userId={item.user} friendship={true} />
              </>
            )
          })}
      </Row>


      <Card.Title>My friends(Query in Friends)</Card.Title>

      <Row>
        {friends &&
          friends?.map((item, index) => {
            return (
              <>
                <FriendCard userId={item.user} friendship={true} />
              </>
            )
          })}
      </Row>

      

      <Card.Title>Blocked users</Card.Title>
      <Row>
        {blocked &&
          blocked?.map((item, index) => {
            return (
              <>
                <FriendCard userId={item} friendship={false} />
              </>
            )
          })}
      </Row>
    
    </div>
  )
}

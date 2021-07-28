import { useContext, useState, useEffect, React } from "react"
import { GET_MY_INFO, GET_USER_BY_ID } from "../GraphQL/Queries"
import { useQuery } from "@apollo/client"
import { ContextHeader } from "../constants"
import { ListGroup, Row, Card, Col } from "react-bootstrap"
import FriendCard from "./FriendCard"
import { AuthContext } from "../App"

export default function Friends() {
  const { token } = useContext(AuthContext)
  const [friends, setFriends] = useState()
  const [blocked, setBlocked] = useState()

  const { loading, error, data, refetch } = useQuery(
    GET_MY_INFO,
    ContextHeader(token),
    { pollInterval: 1000 }
  )
  /*
  const [userOneById, { data: nameById }] = useQuery(GET_USER_BY_ID, {
      variables: { _id: "0" },
    });
  
    console.log(nameById )
*/

  /*function ShowUser( {userId} ) {
      const { loadingUserById, errorUserById, userById } = useQuery(GET_USER_BY_ID, 
      {ContextHeader, 
        variables:  { userId } })
     // return userById;
    
     if (loadingUserById) return null;
     if (errorUserById) return `Error! `;
    if (userById) return userById;
  };
  console.log("showUserById", ShowUser("60eb61b33a2481451c1cd7ad"));*/
  useEffect(() => {
    setFriends(data?.userSelf?.friends)
    setBlocked(data?.userSelf?.blocked)
  }, [])

  useEffect(() => {
    if (data?.userSelf?.friends || !friends || !blocked) {
      refetch()
      setFriends(data?.userSelf?.friends)
      setBlocked(data?.userSelf?.blocked)

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
      <Card.Title>My friends</Card.Title>

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

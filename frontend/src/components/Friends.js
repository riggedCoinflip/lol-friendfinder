import { useState, useEffect, React } from "react"
import { GET_MY_INFO, GET_USER_BY_ID } from "../GraphQL/Queries"
import { useQuery } from "@apollo/client"
import { ContextHeader } from "../constants"
import { ListGroup } from "react-bootstrap"

export default function Friends() {
  const [friends, setFriends] = useState()
  const [blocked, setBlocked] = useState()

  const { loading, error, data, refetch } = useQuery(
    GET_MY_INFO,
    ContextHeader,
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
    if (data?.userSelf?.friends || !friends || blocked) {
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

  return (
    <div className="friends">
      Id from <strong>{data?.userSelf?.name}'s</strong> friends: (id):
      <ListGroup horizontal>
        {friends &&
          friends.map((item, index) => {
            return (
              <ListGroup.Item name="friends" variant="success" key={index + 1}>
                {item.user}
              </ListGroup.Item>
            )
          })}
      </ListGroup>

      Id from blocked users:
      <ListGroup horizontal>
        {blocked &&
          blocked.map((item, index) => {
            return (
                <ListGroup.Item
                  name="blockedUsers"
                  variant="info"
                  action 
                  key={index + 1}
                >
                  {item}
                </ListGroup.Item>
            )
          })}
      </ListGroup>
    </div>
  )
}

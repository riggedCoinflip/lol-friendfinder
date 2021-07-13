import { useState, useEffect, React } from "react"
import { ListGroup } from "react-bootstrap"
import { GET_USER_BY_ID } from '../GraphQL/Queries'
import { ContextHeader} from "../constants"
import { useQuery } from "@apollo/client"

export default function BlockedUsers(props) {
  const [blocked, setBlocked] = useState()

  useEffect(() => {
    setBlocked(props?.data?.userSelf.blocked)
  }, [])

  useEffect(() => {
    if (blocked) {
      setBlocked(props?.data?.userSelf.blocked)
    }
  }, [blocked])

  console.log("blocked", blocked)

   function ShowUser( {userId} ) {
      const { loadingUserById, errorUserById, userById } = useQuery(GET_USER_BY_ID, 
      {ContextHeader, 
        variables:  { userId } })
     // return userById;
    
     if (loadingUserById) return null;
     if (errorUserById) return `Error! `;
    if (userById) return userById;
  };
  console.log("showUserById", ShowUser("60eb61b33a2481451c1cd7ad"));

  return (
    <div className="blocked">
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
                  {/*
                  {userOneById({
                  variables: {
                    _id: item,
                  },
                })}
              */}
                  {item}
                </ListGroup.Item>
            )
          })}
      </ListGroup>
    </div>
  )
}

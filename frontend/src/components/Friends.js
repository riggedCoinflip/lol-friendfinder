import { useState, useEffect, React } from "react"
import { ListGroup } from "react-bootstrap"

export default function Friends(props) {
  const [friends, setFriends] = useState(props?.state)

  useEffect(() => {
      setFriends(props?.state)
    
  }, [])

/*
  useEffect(() => {
    if (!friends) {
      setFriends(props?.data?.userSelf.friends)
    }
  }, [friends])

  TO SHOW THE USERS BY ID; CHECK IN LOGIN HOW THE QUERY WAS CALLED;LINE 33-41
*/
  console.log("friends/from profile", friends)

  return (
    <div className="friends">
      3Id from your actual friends: (id):
      <ListGroup horizontal>
        {friends &&
          friends.map((item, index) => {
            return (
              <ListGroup.Item
                name="spoken-language"
                variant="success"
                key={index + 1}
              >
                {item.user}
              </ListGroup.Item>
            )
          })}
      </ListGroup>
    </div>
  )
}

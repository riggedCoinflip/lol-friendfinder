import React, { useEffect, useState } from "react"
import "./Users.css"
import icon from "../../assets/icon.png"
import like from "../../assets/like.svg"
import dislike from "../../assets/dislike.svg"
import itsamatch from "../../assets/itsamatch.png"
import { GET_USER_TO_SWIPE } from "../../GraphQL/Queries"
import { UPDATE_USER, SWIPE_USER } from "../../GraphQL/Mutations"
import { useQuery, useMutation } from "@apollo/client"
import { ContextHeader } from "../../constants"
import { Badge, Image } from "react-bootstrap"

export default function Users({ match }) {
  const [users, setUsers] = useState([])
  const [userIndex, setUserIndex] = useState(0)
  const [matchDev, setMatchDev] = useState(null)
  const [errored, setErrored] = useState(false)

  const [avatar, setAvatar] = useState(
    "https://www.w3schools.com/howto/img_avatar.png"
  )

  useEffect(() => {
    if (dataQuery) setUsers(dataQuery.userManyToSwipe)
    console.log("useEffect[]", users)
  }, [])

  useEffect(() => {
    refetch()
    setUsers(dataQuery?.userManyToSwipe)
  }, [users])

  const {
    loading,
    error,
    data: dataQuery,
    refetch,
  } = useQuery(GET_USER_TO_SWIPE, ContextHeader)

  const [swipeUser, { data: dataSwipeUser }] = useMutation(
    SWIPE_USER,
    ContextHeader
  )

  const [updateUser, { data: dataUpdate }] = useMutation(
    UPDATE_USER,
    ContextHeader
  )

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error </p>

  return (
    <div className="main-container">
      {users?.length >= 0 &&
      // users?.[0] &&
      users &&
      userIndex < users.length ? (
        <ul>
          {
            // users.map(user => (   // For img alt={users.name[0]}
            <li key={users[userIndex]?._id} >
              <div className="main-verticalhorizontal">
                <Image
                  src={users?.[userIndex]?.avatar}
                  onerror="this.src={avatar}"
                  width="300"
                  height="300"
                  roundedCircle
                />
              </div>

              <footer>
                <strong id="name"> {users?.[userIndex]?.name} </strong>
                <br />
                <strong>Age:{users[userIndex]?.age}</strong>
                <p>{users[userIndex]?.aboutMe}</p>

                {/*spoken languages*/}
                {users[userIndex]?.languages.map((languages, index) => {
                  return (
                    <Badge pill variant="danger">
                      {languages}
                    </Badge>
                  )
                })}
                <div className="right-element">
                  <button
                    id="block-button"
                    onClick={(e) => {
                      e.preventDefault()
                      updateUser({
                        variables: {
                          blocked: { toPush: users[userIndex]?._id },
                        },
                      }).catch(() => {
                        setErrored(true)
                      }).then((res) => {
                        refetch()
                      })

                      setUserIndex(userIndex + 1)
                      console.log(
                        "user was blocked: ",
                        users[userIndex]._id,
                        users[userIndex].name,
                        userIndex
                      )
                    }}
                  >
                    Block user
                  </button>
                </div>
              </footer>

              <div className="buttons">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()

                    swipeUser({
                      variables: {
                        recipient: users[userIndex]?._id,
                        status: "disliked",
                      },
                    }).then((res) => {
                      refetch()
                    })

                    console.log(
                      "user was DIS-liked, _id/Name",
                      users[userIndex]._id,
                      users[userIndex].name,
                      userIndex
                    )
                    setUserIndex(userIndex + 1)
                  }}
                >
                  <img src={dislike} alt="Dislike" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    swipeUser({
                      variables: {
                        recipient: users?.[userIndex]?._id,
                        status: "liked",
                      },
                    }).then((res) => {
                      refetch()
                      //  setUsers(...users, users.filter(item => item.name !== users[userIndex]?.name));
                      // console.log('Users after removing ', users[userIndex]?.name,'/Users: ', users)
                      //                  removeUserFromState(e);
                    })

                    console.log(
                      "user was liked, _id/Name ",
                      users[userIndex]?._id,
                      users[userIndex]?.name,
                      userIndex
                    )
                    setUserIndex(userIndex + 1)
                  }}
                >
                  <img src={like} alt="Like" />
                </button>
              </div>
            </li>
          }
        </ul>
      ) : (
        <div className="empty">
          <img src={icon} alt="Tinder" className="icon" />
          <h2>There's no one else here.</h2>
        </div>
      )}
      {matchDev && (
        <div className="match-container">
          <img src={itsamatch} alt="it's a match" />
          <img className="userImage" alt="" />
          <strong>Name</strong>
          <p>bio</p>
          <button type="button">Fechar</button>
        </div>
      )}
    </div>
  )
}

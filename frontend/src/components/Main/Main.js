import React, { useEffect, useState } from "react";
import "./Main.css";
//import dummyUsers from "../../util/dummyUsers.json"
import icon from "../../assets/icon.png";
import like from "../../assets/like.svg";
import dislike from "../../assets/dislike.svg";
import itsamatch from "../../assets/itsamatch.png";

import { useQuery, gql, useMutation } from '@apollo/client';
import * as Constants from '../../constants'
import { Badge } from 'react-bootstrap';

//(filter: {_operators: {ingameRole: {in: [Bot]}}})
const GET_USER_TO_SWIPE = gql`
        { 
          userManyToSwipe
{
        name
        age
        languages
        ingameRole
        _id
        gender  
        aboutMe     
}
}`;

const SWIPE_USER = gql`
mutation 
    swipe (
			$recipient: MongoID
        $status: String!
    )
  {
    swipe
  (    record: {
            recipient:  $recipient
            status:  $status
        }) {
        record{
            requester
            recipient
            status
        }
    }
}
     

`;

export default function Main({ match }) {

  const [users, setUsers] = useState([]);
  const [userIndex, setUserIndex] = useState(0);
  const [matchDev, setMatchDev] = useState(null);

  useEffect(() => {
    if (dataQuery) setUsers(dataQuery.userManyToSwipe);
    console.log('useEffect[]', users)
  }, []);

  useEffect(() => {
   // console.log('Somebody was dis/liked')
  
  }, [users]);

  const { loading, error, data: dataQuery, refetch } = useQuery(GET_USER_TO_SWIPE,
    {
      context: {
        headers: {
          "x-auth-token": Constants.AUTH_TOKEN
        }
      }
    })

    const [swipeUser, { data: dataSwipeUser }] = useMutation(SWIPE_USER, {
      context: {
        headers: {
          "x-auth-token": Constants.AUTH_TOKEN
        }
      }
    })
    

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error  </p>;

  return (
    <div className="main-container">


      {users.length >= 0 &&
     // users?.[0] &&
       //users ===  'undefined' &&
     userIndex < users.length ? (
        <ul>
          {
            // users.map(user => (   // For img alt={users.name[0]}
            <li key={users[userIndex]?._id}>
              <img src="https://placekitten.com/640/392" />
              <footer>
                <strong id="name"> {users?.[userIndex]?.name }  </strong>
                <br/>
                <strong>Age:{users[userIndex]?.age}</strong>
                <p>{users[userIndex]?.aboutMe}</p>

                {/*spoken languages*/}
                {users[userIndex]?.languages.map((languages, index) => {
                  return (
                    <Badge pill variant="danger">{languages}</Badge>
                  )
                })}
                <div className="right-element">
                  <button id="block-button"
                    onClick={e => {

                      e.preventDefault();
                      console.log('user was blocked: ', userIndex)
                    }}
                  >Block user</button>
                </div>
              </footer>

              <div className="buttons">
                <button type="button" onClick={e => {
                  e.preventDefault();
                
                  swipeUser({
                    variables: {
                      recipient: users[userIndex]?._id,
                      status: "disliked"
                    }
                  });

                  console.log('user was DIS-liked, _id/Name', users[userIndex]._id, users[userIndex].name, userIndex)
                  setUserIndex(userIndex + 1);

                }
                }>
                  <img src={dislike} alt="Dislike" />
                </button>

                <button type="button" onClick={e => {
                  e.preventDefault();
                swipeUser({
                  variables: {
                    recipient: users?.[userIndex]?._id,
                    status: "liked"
                  }
                }).then(res => {
                //  setUsers(...users, users.filter(item => item.name !== users[userIndex]?.name));
                  // console.log('Users after removing ', users[userIndex]?.name,'/Users: ', users)

//                  removeUserFromState(e);
                });

                  console.log('user was liked, _id/Name ', users[userIndex]?._id, users[userIndex]?.name, userIndex)
                  setUserIndex(userIndex + 1);
                }
                } >
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
          <button type="button"

          >
            Fechar
          </button>
        </div>
      )}
    </div>
  );
}

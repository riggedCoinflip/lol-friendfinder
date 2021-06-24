import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Main.css";
//import dummyUsers from "../../util/dummyUsers.json"
import icon from "../../assets/icon.png";
import like from "../../assets/like.svg";
import dislike from "../../assets/dislike.svg";
import itsamatch from "../../assets/itsamatch.png";

import { useQuery, gql } from '@apollo/client';
import * as Constants from '../../constants'
import { Badge } from 'react-bootstrap';



const howManyUsers = 12; //for the request
const GET_USER_MANY = gql`
        { 
          userManyAdmin(filter: { role:user }, limit: 20)
{
        name
        email
        avatar
        age
        aboutMe
        languages       
}
}`;



export default function Main({ match }) {

  const [users, setUsers] = useState([]);
  const [userIndex, setUserIndex] = useState(0);


  const [matchDev, setMatchDev] = useState(null);



  useEffect(() => {
    setUsers(data.userManyAdmin);
    console.log('LoadUsers', users)

  }, []);

  useEffect(() => {
    
    console.log('Somebody was dis/liked', users)

  }, [userIndex]);

  const { loading, error, data } = useQuery(GET_USER_MANY,
    {
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


      {users.length > 0 ? (
        <ul>
          {
         // users.map(user => (   // For img alt={users.name[0]}
            <li key={users[userIndex]._id}>
              <img src="https://placekitten.com/640/392"  />
              <footer>
                <strong>{users[userIndex].name}  </strong>
                <strong>{users[userIndex].age}</strong>
                <p>{users[userIndex].aboutMe}</p>

            {/*spoken languages*/}
          {users[userIndex].languages.map((languages, index) => {
            return (
              <Badge pill variant="danger">{languages}</Badge>
              )
            })}
          <div className="right-element">
         <button  id="block-button"
           onClick={e => {

            e.preventDefault();
            console.log('user was blocked: ')
          }}
          >Block user</button>
          </div>
              </footer>

              <div className="buttons">
                <button type="button" onClick={e => {
                  e.preventDefault();
                  console.log('user was DIS-liked ', userIndex)
                  setUserIndex(userIndex-1);

                }
                }>
                  <img src={dislike} alt="Dislike" />
                </button>

                <button type="button" onClick={e => {

                  e.preventDefault();
                  console.log('user was liked ', userIndex)
                  setUserIndex(userIndex+1);
                }
                } >
                  <img src={like} alt="Like" />
                </button>
              </div>
            </li>
      //    ))
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

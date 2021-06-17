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
  const [matchDev, setMatchDev] = useState(null);



  useEffect(() => {
    setUsers(data.userManyAdmin);
    console.log('LoadUsers', users)

  }, []);

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
      <Link to="/">
        <img src={like} alt="Tinder" />
      </Link>

      {users.length > 0 ? (
        <ul>
          {users.map(user => (
            <li key={user._id}>
              <img src="https://placekitten.com/640/392" alt={user.name} />
              <footer>
                <strong>{user.name}  </strong>
                <strong>{user.age}</strong>
                <p>{user.aboutMe}</p>


          {user.languages.map((languages, index) => {
            return (
              <Badge pill variant="danger">{languages}</Badge>

            )
          })}

              </footer>

              <div className="buttons">
                <button type="button" onClick={e => {
                  e.preventDefault();
                  console.log('user was DIS-liked')

                }
                }>
                  <img src={dislike} alt="Dislike" />
                </button>

                <button type="button" onClick={e => {

                  e.preventDefault();
                  console.log('user was liked')
                }
                } >
                  <img src={like} alt="Like" />
                </button>
              </div>
            </li>
          ))}
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

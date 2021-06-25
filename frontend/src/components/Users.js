import { useState, React, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { AUTH_TOKEN } from '../constants';
import * as Constants from '../constants'
import Main from './Main/Main';


import { Card, CardGroup} from 'react-bootstrap';
/*
const howManyUsers = 22; //for the request
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

*/
function Users () {

/*
  const { loading, error, data } = useQuery(GET_USER_MANY,
    {
      context: {
        headers: {
          "x-auth-token": Constants.AUTH_TOKEN
        }
      }
    })

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error or maybe you arent admin  </p>;

  console.log(data)
  let imgURL = `https://placekitten.com/640/392`;
  console.log(imgURL)
*/
  return (
    <div className="user">

<Main />

    </div>
    );
        }




export default Users;
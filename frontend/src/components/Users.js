import { useState, React } from 'react';
import { useQuery, gql } from '@apollo/client';
import { AUTH_TOKEN } from '../constants';

const GET_USER = gql`
        { userManyAdmin(filter:{})

{
        name
        email
        role
        favouriteColor
}
}`;


const Users = () => {
  //  const [users, setUsers] =  useState(null);


  const { loading, error, data } = useQuery(GET_USER, {
    context: {
      headers: {
        "x-auth-token": AUTH_TOKEN
      }
    }
  })

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  //setUsers(); {data.userOneAdmin.name}
  console.log(data)

  return (
    <div>

      <p>Other users are ...</p>
      <tr>
                <th>ID -</th>
                <th>Name-</th>
                <th>Favorite color</th>
              </tr>
      {
      data.userManyAdmin &&
        data.userManyAdmin.map((data, index) => {

          return (
            <table key={index}>
              <tbody>
              <tr>
                <td>{index + 1}</td>
                <td>{data.name}</td>
                <td>{data.favouriteColor}</td>
                <td>{data.role}</td>
              </tr>
              </tbody>
            </table>
          );
        })

      }

    </div>);
}




export default Users;
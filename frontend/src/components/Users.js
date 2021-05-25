import { useState, React, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { AUTH_TOKEN } from '../constants';

const howManyUsers = 8; //for the request
const GET_USER = gql`
        { userManyAdmin(limit: ${howManyUsers})

{
        name
        favouriteColor
}
}`;


const Users = () => {
  //  const [users, setUsers] =  useState(null);
  const [count, setCount] =  useState(3);
  useEffect(() => {
    console.log('count changed')
}, [count]);
function increCount() {
  setCount( prevCount => prevCount +1 ) }
function decreCount() {
      setCount( prevCount => prevCount -1 ) }
//const [errored, setErrored] = useState(false);



  const { loading, error, data } = useQuery(GET_USER, {
    context: {
      headers: {
        "x-auth-token": AUTH_TOKEN
      }
    }
  })

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error  </p>;
  //setUsers(); {data.userOneAdmin.name}
  console.log(data)

  return (
    <div>

      <p>Show me {count} users...</p>
      <button onClick={decreCount}>-</button>
                   <span>-</span>
                  
                   <button onClick={increCount}>+</button>
      <tr>
                <th>ID -</th>
                <th>Name-</th>
                <th>Favorite color</th>
              </tr>
      {
   
      data.userManyAdmin &&
          data.userManyAdmin.slice(0, count).map((data, index) => {

          return (
            <table key={index}>
              <tbody>
              <tr>
                <td>{index + 1}</td>
                <td>{data.name}</td>
                <td>{data.favouriteColor}</td>
               
              </tr>
              </tbody>
            </table>
          );
        })

      }

    </div>);
}




export default Users;
import { useState, React } from 'react';
import { useQuery, gql } from '@apollo/client';
import { AUTH_TOKEN } from '../constants';

const GET_USER = gql`
       { userOneAdmin(filter:{name:"Carlo"})
        {name
        email
        role}         
        }`;


const Users = () => {
  //  const [users, setUsers] =  useState(null);

  
const { loading, error, data } = useQuery(GET_USER, {
  context: {
    headers: {
        "x-auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDlhYWYwMGIyNzUwZDNmMTBjMDAxMzIiLCJ1c2VybmFtZSI6IkNhcmxvIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjIwOTkyMDI2LCJleHAiOjE2MjEwNzg0MjZ9.WohVb_JFgPxJ6RnCfaZNh4nx8O9XA2QCZNuqgybJipA"
    }
}})

if (loading) return <p>Loading...</p>;
if (error) return <p>Error!</p>;
//setUsers(); {data.userOneAdmin.name}
console.log(data)

return(
<div>
  
<p>Coming soon ...</p>

{
/*
data.user &&
          data.user.map((data, index) => {
          
            return (
              <div key={index}>
                <h3>ID {index + 1}</h3>
                <h2>{data.name}</h2>
              </div>
            );
        })
    */
    } 

</div>);
}




export default Users;
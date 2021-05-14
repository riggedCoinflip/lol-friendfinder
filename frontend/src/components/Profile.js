import { useState, React } from 'react';
import { useQuery, gql } from '@apollo/client';
import { AUTH_TOKEN } from '../constants';
import Button from '@material-ui/core/Button';

const GET_USER = gql`
       { userOneAdmin(filter:{name:"Carlo"})
        {name
        email
        role
        favouriteColor
        }         
        }`;


const Profile = () => {
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
<div id="user-info">
  
<p>Welcome {data.userOneAdmin.name}</p>
<p>Role: {data.userOneAdmin.role}</p>
<p>Fav color: {data.userOneAdmin.favouriteColor}</p>
<p>Fav email: {data.userOneAdmin.email}</p>
<Button  variant="outlined" color="primary"> Edit your profile WIP </Button>
      
    


</div>

);
}




export default Profile;
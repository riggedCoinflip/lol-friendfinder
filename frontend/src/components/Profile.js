import { useState, React } from 'react';
import { useQuery, gql } from '@apollo/client';
//import { AUTH_TOKEN } from '../constants';
import * as Constants from '../constants'

import Button from '@material-ui/core/Button';

const GET_USER = gql`
       { userOneAdmin(filter:{name :"Carlo"})
        {name
        email
        role
        favouriteColor
        }         
        }`;


const Profile = () => {
// const [profile, setProfile] =  useState(null);


const { loading, error, data } = useQuery(GET_USER, {
  context: {
    headers: {
        "x-auth-token": Constants.AUTH_TOKEN 
    }
}})
console.log('from Profile: '+ Constants.AUTH_TOKEN)

if (loading) return <p>Loading...</p>;
if (error) return <p>Error!</p>;
//setProfile(data); 
console.log(data);


return(
<div id="user-info">
  
<p>Welcome {data.userOneAdmin.name}</p>
<p>Role: {data.userOneAdmin.role}</p>
<p>Fav color: {data.userOneAdmin.favouriteColor}</p>
<p>Fav email: {data.userOneAdmin.email}</p>
<Button  variant="outlined" color="primary"
 onClick={() => {
                  // setProfile('');
                  localStorage.clear();
                    console.log('This should clean all');
                }}

> Clear Profile Data </Button>
      
    


</div>

);
}




export default Profile;
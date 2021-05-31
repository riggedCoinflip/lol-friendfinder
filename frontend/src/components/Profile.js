import { useState, React } from 'react';
import { useQuery, gql } from '@apollo/client';
//import { AUTH_TOKEN } from '../constants';
import * as Constants from '../constants'

//import Button from '@material-ui/core/Button';
import {Button} from 'react-bootstrap';

const GET_USER = gql`
       { userSelf
        {name
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
//console.log('from Profile: '+ Constants.AUTH_TOKEN)

if (loading) return <p>Loading...</p>;
if (error) return <p>Error!</p>;
console.log(data);


return(
<div id="user-info">
  
<p>Welcome {data.userSelf.name}</p>
<p>Fav color: {data.userSelf.favouriteColor}</p>
<Button  variant="primary"
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
import { useState, React } from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_USERS = gql`
       { user
         {
            name
           }          
        }`;


const Users = () => {
  //  const [users, setUsers] =  useState(null);

const { loading, error, data } = useQuery(GET_USERS)
if (loading) return <p>Loading...</p>;
if (error) return <p>Error!</p>;
//setUsers();
console.log(data)

return(
<div>
  
<p>Data is there, check the console</p>

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
import { useState, React, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { AUTH_TOKEN } from '../constants';
import * as Constants from '../constants'
import {
   ListGroup
} from 'react-bootstrap';

/*
const GET_USER_BY_ID = gql`
{
userOneById ( $id: MongoID! ){
    userOneById(_id: $id)
    {
        _id
        name
        
    }
}
}
`;
*/
export default function Friends(props) {
 const [friends, setFriends] = useState(props.data.userSelf.friends)
 

  
/*
  const [getUserById, {loading, error, data}] = useQuery(GET_USER_BY_ID,
    {
      context: {
        headers: {
          "x-auth-token": Constants.AUTH_TOKEN
        }
      }
    })

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
*/
  console.log('friends/from profile', friends );

  return (
    <div className="friends">
     <ListGroup horizontal>
        {
          friends &&
          friends
            .map((item, index) => {
              return (
                <ListGroup.Item name="spoken-language"  variant="success" key={index + 1} >
                  {item.user}

                
                </ListGroup.Item>

              );
            })
        }
      </ListGroup>
    </div>
  );
}





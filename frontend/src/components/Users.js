import { useState, React, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { AUTH_TOKEN } from '../constants';
import { Card, CardGroup} from 'react-bootstrap';

const howManyUsers = 8; //for the request
const GET_USER = gql`
        { userManyAdmin(limit: ${howManyUsers})

{
        name
        favouriteColor
}
}`;


function Users () {
  const [count, setCount] = useState(3);
 
  useEffect(() => {
    console.log('qty users changed')
  }, [count]);
 
  function increCount() {
    setCount(prevCount => prevCount + 1)
  }
  function decreCount() {
    setCount(prevCount => prevCount - 1)
  }

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
  let randomNum = Math.floor(Math.random() * 1000);
  let imgURL = `https://placekitten.com/640/${randomNum}`;
  console.log(imgURL)

  return (
    <div className="user">

      <p>Show me {count} users...</p>
      <p>ToDo: filter using a checkbox...</p>
      <button onClick={decreCount}>-</button>
      <span>-</span>

      <button onClick={increCount}>+</button>
      
      <CardGroup>
      {

        data.userManyAdmin &&
        data.userManyAdmin.slice(0, count).map((data, index) => {

          return (

            <Card className="p-4 row" key={index} style={{ width: '18rem'  }}>
              <Card.Img rounded variant="top" src={imgURL}/>
              <Card.Body>
                <Card.Title>ID:{index + 1} Name: {data.name}  </Card.Title >
                
                  <Card.Text>
                    Fav-Color {data.favouriteColor}
                  </Card.Text>

                  </Card.Body>
             </ Card>
          );
        })

      }
            </CardGroup>


    </div>);
        }




export default Users;
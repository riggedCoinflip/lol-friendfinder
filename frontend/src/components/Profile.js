import { React } from 'react';
import { useQuery, gql } from '@apollo/client';
import * as Constants from '../constants'
import Languages from './Languages';
import {
  Button, Container, Card, Form, Col, Image, Row,
  InputGroup, FormControl, ListGroup
} from 'react-bootstrap';

const GET_USER = gql`
       { userSelf
        {
          name
          aboutMe
          languages
          gender
          avatar
          ingameRole

        }         
        }`;

const Profile = () => {

  const { loading, error, data } = useQuery(GET_USER, {
    context: {
      headers: {
        "x-auth-token": Constants.AUTH_TOKEN
      }
    }
  })

 
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  console.log(data);

  return (

    <div id="user-info">

      <Container>
        <Card.Title>Personal Info</Card.Title>

        <Form>

          <Row>
            <Col>
              <Image src="https://img.icons8.com/clouds/2x/name.png" rounded />
            </Col>

            <Col>
              <InputGroup className="mb-3" weight="50px">
                <InputGroup.Prepend>
                  <InputGroup.Text id="username-input">@</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  value={data.userSelf.name}
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />

              </InputGroup>
  Gender
   <FormControl
                value={data.userSelf.gender}
                aria-label="Gender"
                aria-describedby="basic-addon1"
              />

  Avatar
       <FormControl
                value={data.userSelf.avatar}
                aria-label="Avatar"
                aria-describedby="basic-addon1"
              />

  Age
    <FormControl
                value={data.userSelf.age}
                aria-label="Age"
                aria-describedby="basic-addon1"
              />

  IngameRole
  <ListGroup horizontal>
                {
                  data.userSelf.ingameRole &&
                  data.userSelf.ingameRole.map((data, index) => {
                    return (
                      <ListGroup.Item variant="dark" key={index + 1} >
                        {data}
                      </ListGroup.Item>
                    );
                  })
                }
              </ListGroup>

              <br />

             
      <Languages />
      
  <ListGroup horizontal>
            {

              data.userSelf.languages &&
              data.userSelf.languages.map((data, index) => {
                return (
                  <ListGroup.Item variant="success" key={index + 1} >
                    {data}
                  </ListGroup.Item>
                  
                );
              })
            }
          </ListGroup>
              <br />


            </Col>

          </Row>

          <Row>
            <Form.Text className="text-muted">
              About me</Form.Text>

            <Form.Control as="textarea" rows={3}
              value={data.userSelf.aboutMe} />

          </Row>

          <br />

          <div>
            <Button variant="primary" size="sm"
              onClick={() => {
                console.log('Data was saved');
              }}   > Save changes </Button>{'  '}

            <Button variant="danger" size="sm"
              onClick={() => {
                console.log('Data was saved');
              }}   > Delete account </Button>{' '}

            <br />
          </div>



        </Form>
      </Container>





    </div>

  );
}
export default Profile;

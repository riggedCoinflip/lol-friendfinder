import { React } from 'react';
import { useEffect, useState, useQuery, gql, useMutation, useApolloClient } from '@apollo/client';
import * as Constants from '../constants'
import Languages from './Languages';
import {
  Button, Container, Card, Form, Col, Image, Row,
  InputGroup, FormControl, ListGroup, Badge
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

const UPDATE_USER = gql`
mutation userUpdateSelf($language:String){
userUpdateSelf( 
  record: { 
         languages: [ $language]
         
       }
   ) {
    record {
      name
      languages
    }
  } 
}`;

export default function Profile () {
  const client = useApolloClient();

  const [state, setState] = useState({
    aboutMe: "",
    gender: "",
    })

   
  //console.log('Data for State' + data);

useEffect(() => {
  console.log(state)
}, [state])

/*
useEffect(() => {
  if (data) {
    return;
  }
  // Do something only when `someCondition` is falsey
}, [state]);
*/
 

const changeHandler = e => {
  setState({ [e.target.name]: e.target.value})
}
  const { loading, error, data } = useQuery(GET_USER, {
    context: {
      headers: {
        "x-auth-token": Constants.AUTH_TOKEN
      }
    }
  })

 const [update_User] = useMutation(UPDATE_USER, {
    context: {
      headers: {
        "x-auth-token": Constants.AUTH_TOKEN
      }
  }})
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  console.log(data);
 


/*ToDo:
1-get UserInfo from DB and set in State
2-add onChangeHandler for each field
3-Send the actual State to the DB, if "save" is pressed
*/

//setState({ ...state, aboutMe: data.userSelf.aboutMe})


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
                  /* OP2 value=state.name*/
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />

              </InputGroup>
  Gender
   <FormControl
                placeholder="a"
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
                    <Badge pill variant="danger">
                      x
                    </Badge>
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
              value= {data.userSelf.aboutMe}
              id="aboutMe"
              onChange = {changeHandler}

              />

          </Row>

          <br />

          <div>
            <Button variant="primary" size="sm"
              onClick={e => {

                  e.preventDefault();
                  update_User({ variables: { 
                                            aboutMe: data.aboutMe
                                           
                                          } });

                }} > Save changes </Button>{'  '}

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

import { useEffect, useState, React } from 'react';
import { useQuery, gql, useMutation, useApolloClient } from '@apollo/client';
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
mutation userUpdateSelf($aboutMe: String){
userUpdateSelf( 
  record: { 
    aboutMe: $aboutMe
    
       }
   ) {
    record {
      aboutMe
      name
      languages
      gender
      avatar
    }
  } 
}`;

export default function Profile() {
  const client = useApolloClient();

  const [state, setState] = useState({})


  //getting data from db and saving on state
  useEffect(() => {
    if (data) {
      // alert("dataUpdate exist");
      setState(data.userSelf)
    }
  }, []);


  const { loading, error, data, refetch } = useQuery(GET_USER,
    {
      context: {
        headers: {
          "x-auth-token": Constants.AUTH_TOKEN
        }
      }
    })

  const [updateUser, { data: dataUpdate }] = useMutation(UPDATE_USER, {
    context: {
      headers: {
        "x-auth-token": Constants.AUTH_TOKEN
      }
    }
  })



  //Get users data
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;


  console.log('Data Mutation:', dataUpdate);
  console.log('Data Query:', data);
  console.log('State', state);

  const changeHandler = e => {
    e.persist(); //important
    setState(state => ({ ...state, [e.target.name]: e.target.value }));
  }

  const getValuesFromChild = (values) => {
    console.log("value from child", values)
    // setState(state => ({ ...state,  "languages": values}));

  }
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
                  name="name"
                  value={state.name}
                  onChange={changeHandler}
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />

              </InputGroup>
  Gender
   <FormControl
                value={state.gender}
                onChange={changeHandler}
                name="gender"
                aria-label="Gender"
                aria-describedby="basic-addon1"


              />

  Avatar
       <FormControl
                value={state.avatar}
                aria-label="Avatar"
                aria-describedby="basic-addon1"
              />

  Age
    <FormControl
                value={state.age}
                aria-label="Age"
                aria-describedby="basic-addon1"
              />

  IngameRole
  <ListGroup horizontal>
                {
                  state.ingameRole &&
                  state.ingameRole.map((data, index) => {
                    return (
                      <ListGroup.Item variant="dark" key={index + 1} >
                        {data}
                      </ListGroup.Item>
                    );
                  })
                }
              </ListGroup>

              <br />


              {/**/}
              <Languages getValuesFromChild={getValuesFromChild}
                state={state}

              />
              <ListGroup horizontal>
                {

                  state.languages &&
                  state.languages.map((language, index) => {
                    return (
                      <ListGroup.Item variant="success" key={index + 1} >
                        {language}
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

            <Form.Control
              as="textarea"
              rows={3}
              value={state.aboutMe}
              id="aboutMe"
              onChange={changeHandler}
              name="aboutMe"
              type="text"
            />

          </Row>

          <br />

          <div>
            <Button variant="primary" size="sm"
              onClick={e => {

                e.preventDefault();
                updateUser({
                  variables: {
                    aboutMe: state.aboutMe
                    //,gender: state.gender    
                  }
                  //,refetchQueries: [{query: GET_USER}]  
                });
                alert('Data was updated');

                //get new data
                refetch();

              }
              }
            > Save changes </Button>{'  '}



            <br />
          </div>
        </Form>
      </Container>





    </div>

  );
}

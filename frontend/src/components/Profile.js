import { useState, React } from 'react';
import { useQuery, gql } from '@apollo/client';
//import { AUTH_TOKEN } from '../constants';
import * as Constants from '../constants'

//import Button from '@material-ui/core/Button';
import {Button, Container, Card, Form, Col, Image, Row,
      Dropdown, InputGroup, FormControl } from 'react-bootstrap';

const GET_USER = gql`
       { userSelf
        {name
        aboutMe
          languages
          gender
          avatar
       

        }         
        }`;


const Profile = () => {
 
  // console.log(testDataUsers);
 
   const { loading, error, data } = useQuery(GET_USER, {
   context: {
     headers: {
         "x-auth-token": Constants.AUTH_TOKEN 
     }
 }})
 
 if (loading) return <p>Loading...</p>;
 if (error) return <p>Error!</p>;
 console.log(data);
 
 const languagesArray = [{language: 'DE'}, {language: 'EN'},{language: 'FR'}, {language: 'EN'} ];
 
 console.log(languagesArray);
 
 
 return(
 
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
     Languages
      <FormControl
      value={data.userSelf.languages}
       aria-label="Languages"
       aria-describedby="basic-addon1"

     />
     <br />

  {/*
   <Dropdown>
         <Dropdown.Toggle size="sm" variant="success" id="dropdown-languages">
           Languages
         </Dropdown.Toggle>
 
         <Dropdown.Menu>
           <Dropdown.Item  onClick={languagesArray.splice(1, 0, {language: 'DE3'})}>DE</Dropdown.Item>
           <Dropdown.Item onClick={languagesArray.splice(1, 0, {language: 'EN'})}>EN</Dropdown.Item>
           <Dropdown.Item onClick={languagesArray.splice(1, 0, {language: 'ES'})}>ES</Dropdown.Item>
           <option onClick={languagesArray.push({language: "NEW"})}>Volvo </option>
         </Dropdown.Menu>
      
    
 
 
 </Dropdown>
 {console.log('addedElements:'+ languagesArray)
 }
 {
 languagesArray &&
 languagesArray.map((x, index) => {
 
   return (
     <row key={index} >
      
         <div>{x.language} 
         <Button size="sm" variant="outline-danger"  onClick={languagesArray.splice(x.index, 1)}> X</Button>
         </div >
        
      </row>
   );
 })
 }
 
 {console.log('deleted:' + languagesArray)
 }
 
 
*/}
 
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
     <Button  variant="primary" size="sm"
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
import {  React, useState, useEffect } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import * as Constants from '../constants'
//import {selectedLanguages} from './Profile';

import {   Dropdown, ListGroup, Badge
      } from 'react-bootstrap';

const GET_LANGUAGES = gql`
{
  languageMany(filter: {} limit: 30) 
  {
    name 
    alpha2 
  }
}`;


//ToDo: pass the functions from this component with props
const Languages = (props) => {
 
 // const [local_Languages, setLocal_Languages] = useState(props.state.languages);
  var local_Languages = [] ;//props.state.languages
 
  useEffect(() => {

    local_Languages= local_Languages.concat(props.state.languages);
  console.log('A2: ', local_Languages)
}, [])

  useEffect(() => {
 //props.getValuesFromChild(local_Languages)
   console.log('localL: ', local_Languages)

}, [local_Languages])

   const { loading, error, data } = useQuery(GET_LANGUAGES, {
    context: {
      headers: {
        "x-auth-token": Constants.AUTH_TOKEN
      }
  }})

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error!</p>;

 return(
 
 <div id="avaliableLanguages">
   
 <Dropdown>
         <Dropdown.Toggle size="sm" variant="success" id="dropdown-languages">
           Languages
         </Dropdown.Toggle>
 
         <Dropdown.Menu>   
         <input type="text" placeholder="English" id= "language-search" name="langs"/>
                   
         {
    data.languageMany &&
    data.languageMany.map((data, index) => {
              return (
                <Dropdown.Item 
                onClick={e => {
                  e.preventDefault();
              
                local_Languages.splice(index, 0, data.name);
                console.log('local_Languages: ', local_Languages)
                  }}
                  key={index+1} >
                     {data.name}
                </ Dropdown.Item>
                    );
                  })

}
         </Dropdown.Menu>
    </Dropdown>
 {/*  */}
   <ListGroup horizontal>
                {

local_Languages &&
local_Languages.map((language, index) => {
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
           
   
        
 
 
 </div>
 
 );
 }
export default Languages;
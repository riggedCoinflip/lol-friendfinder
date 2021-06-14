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
 
  const [local_Languages, setLocal_Languages] = useState([props.state.languages]);
  
  useEffect(() => {
    props.getValuesFromChild(local_Languages)

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
         <input type="text" placeholder="English" id= "language-search"/>
                   
         {
    data.languageMany &&
    data.languageMany.map((data, index) => {
              return (
                <Dropdown.Item 
                onClick={e => {
                  e.preventDefault();
             
              console.log(data.name)
             // setLocal_Languages(data.name)
  // ToDo: Add the selected element to the state, wich shows the languages
            // setLocal_Languages(e.target.push)

                 console.log('Language selected: ', local_Languages)
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

                  props.state.languages &&
                  props.state.languages.map((language, index) => {
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
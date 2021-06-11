import {  React, useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import * as Constants from '../constants'
//import {selectedLanguages} from './Profile';

import {   Dropdown, ListGroup
      } from 'react-bootstrap';

const GET_LANGUAGES = gql`
{
  languageMany(filter: {} limit: 100) 
  {
    name 
    alpha2 
  }
}`;

const UPDATE_LANGUAGES = gql`
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


//ToDo: pass the functions from this component with props
const Languages = (props) => {
 
  const [local_Languages, setLocal_Languages] = useState([]);

   const { loading, error, data } = useQuery(GET_LANGUAGES, {
    context: {
      headers: {
        "x-auth-token": Constants.AUTH_TOKEN
      }
  }})
 
 const [updateLanguage, { data_Mutation }] = useMutation(UPDATE_LANGUAGES, {
 })

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error!</p>;
    console.log(data);
    console.log('data_Mutation: '+data_Mutation);
 
    //console.log("SelectedLnags: " + selectedLanguages);
   // const l =  "spanish";

 return(
 
 <div id="user-info">
   
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
                  updateLanguage({ variables: { language: data.name } });
                  setLocal_Languages(data.name);

                 console.log('L: ' + local_Languages)
                }}
                  key={index+1} >
                     {data.name}
                </ Dropdown.Item>
                    );
                  })

}
         </Dropdown.Menu>
    </Dropdown>
 {/*
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
           
   
          */}
 
 
 </div>
 
 );
 }
export default Languages;
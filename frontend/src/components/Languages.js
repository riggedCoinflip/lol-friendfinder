import {  React } from 'react';
import { useQuery, gql } from '@apollo/client';

import {CardGroup, Container, Card, Dropdown
      } from 'react-bootstrap';

const GET_LANGUAGES = gql`
{
  languageMany(filter: {} limit: 100) 
  {
    name  
  }
}`;

const Languages = () => {
 
   const { loading, error, data } = useQuery(GET_LANGUAGES, {
   context: {
     headers: {
     }
 }})
 
 
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error!</p>;
    console.log(data);

 return(
 
 <div id="user-info">
   
 <Container>
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
                <Dropdown.Item    key={index+1} >
                     {data.name}
                </ Dropdown.Item>
                    );
                  })

}
         </Dropdown.Menu>
      
    
 
 
 </Dropdown>
 
      
          
   </Container>
 
   
 
 
 
 </div>
 
 );
 }
export default Languages;
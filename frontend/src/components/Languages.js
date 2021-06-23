import { React, useState, useEffect } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import * as Constants from '../constants'
//import {selectedLanguages} from './Profile';

import {
  Dropdown, ListGroup, Badge
} from 'react-bootstrap';

const GET_LANGUAGES = gql`
{
  languageMany(filter: {} ) 
  {
    name 
    alpha2 
    nativeName

  }
}`;



const input_alpha2 = "de";

const GET_LANGUAGES_NAME = gql`
{
  languageOne(filter: {alpha2: "de" }) {
    name
  }

}`;

//ToDo: pass the functions from this component with props
const Languages = (props) => {

  const [local_Languages, setLocal_Languages] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  //var local_Languages = [] ;//props.state.languages

  useEffect(() => {
    setLocal_Languages(props.state.languages);
    console.log('useEffect []: ', local_Languages)
  }, [props.state.gender])

  useEffect(() => {
    // props.state.languages=local_Languages;
    console.log('useEffect [local_Languages]: ', local_Languages)

    props.setState(state => ({ ...state, "languages": local_Languages }));


    console.log('props.state.languages: ', props.state.languages)
  }, [local_Languages])



  const { loading, error, data } = useQuery(GET_LANGUAGES, {
    context: {
      headers: {
        "x-auth-token": Constants.AUTH_TOKEN
      }
    }
  })



  const { loadingLanguageName, errorLanguageName, dataLanguageName } =
    useQuery(GET_LANGUAGES_NAME)

  if (loading) return <p>Loading languages...</p>;
  if (loadingLanguageName) return <p>{console.log('loadingLanguageName:')}</p>;

  if (error) return <p>Error!</p>;
  if (errorLanguageName) return <p>Error errorLanguageName! {console.log('errorLanguageName:')}</p>;

  if (dataLanguageName) return <p>Data {console.log('dataLanguageName:')}...</p>;

  /*
    var LNames = data.languageMany
    
    .filter(item => {
      return item.alpha2 === "es" })
    .map(item => {
      return item.name
    });
    console.log('These are the spoken Languages', LNames);
    */
    
  return (

    <div id="avaliableLanguages">


      <Dropdown>
        <Dropdown.Toggle size="sm" variant="success" id="dropdown-languages">
          Languages
         </Dropdown.Toggle>

        <Dropdown.Menu>
          <input autoFocus type="text" placeholder="Type a language...🔍" id="language-search" name="langs"
            onChange={(e) => { setSearchTerm(e.target.value); }}
          />

          {//data to item/element
            data.languageMany &&
            data.languageMany.filter(item => {
              if (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.nativeName.toLowerCase().includes(searchTerm.toLowerCase())
              ) return item
            }).map((item, index) => {
              return (
                <Dropdown.Item
                  onClick={e => {
                    e.preventDefault();

                    //adding another language
                    setLocal_Languages(local_Languages => [...local_Languages, item.alpha2]);
                    console.log('local_Languages, selected: ', item.name)
                    console.log('###Name')
                  }}
                  key={index + 1} >
                  {item.nativeName}
                </ Dropdown.Item>
              );

            })

          }
        </Dropdown.Menu>
      </Dropdown>
      {/*  */}
      <br />
      <ListGroup horizontal>
        {
local_Languages &&
local_Languages
/*
.filter(item => {
  return item.map((item, local_Languages) => 
    {return item.alpha2 === local_Languages} ) 
})
*/
.map((item, index) => {
  return (
          /*local_Languages &&
          local_Languages.map((language, index) => {
            return (
              
              displayedLanguage = displayedLanguage.filter(item => {
                //find index in language Many
                // languageMany.name.map
              })
              */
              <ListGroup.Item name="spoken-language" value={item} variant="success" key={index + 1} >
                {item}

                <Badge pill variant="danger"
                
                onClick={e => {
                  e.preventDefault();
                  const languageToDelete = e.target.parentElement.getAttribute('value');
                  //console.log('you want to delete', LanguageToDelete )
                  //Excluding the language we want to delete
                  setLocal_Languages(local_Languages.filter(item => item !== languageToDelete));
                 // console.log('Deleting Language: ', local_Languages)

              }}
                >
                  X
                    </Badge>
              </ListGroup.Item>

            );
          })
        }
      </ListGroup>


      <p>ToDo: Name of the languages  using localLanguages?
{
  /*
  dataLanguageName.languageOne
*/}
      </p>
    </div>

  );
}
export default Languages;
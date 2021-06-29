import { React, useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import * as Constants from '../constants'

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

const Languages = (props) => {

  const [local_Languages, setLocal_Languages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLocal_Languages(props.state.languages);
    console.log('useEffect []: ', local_Languages)
  }, [props.state.gender])

  useEffect(() => {
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

  if (loading) return <p>Loading languages...</p>;
  if (error) return <p>Error!</p>;


  //This instead make a Database request to convert alpha2 to Name
  function alpha2ToName(input) {
    return data.languageMany.filter(language => {
      return language.alpha2 === input
    })
      .map(language => {
        return language.name
      });
  }

//Test
console.log('This is a test for the function alpha2ToName("en"):', alpha2ToName("en"));

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

          {
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
            .map((item, index) => {
              return (
                <ListGroup.Item name="spoken-language" value={item} variant="success" key={index + 1} >
                  {alpha2ToName(item)}

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
    </div>

  );
}
export default Languages;
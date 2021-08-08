import { useContext, useEffect, useState, React, createContext } from "react"
//import { GET_MY_INFO } from "../GraphQL/Queries"
import { UPDATE_USER } from "../GraphQL/Mutations"
import {  useMutation } from "@apollo/client"
import Languages from "./Languages"
import ProfileImage from "./ProfileImageUpload"

//import Test from "./Test"

import IngameRoles from "./IngameRoles"
import { ContextHeader } from "../constants"
import { AuthContext } from "../App"

import {
  Button,
  Container,
  Card,
  Form,
  Col,
  Row,
  FormControl,
  Dropdown,
} from "react-bootstrap"

export default function Profile() {
  const { token, state, setState, refetch } = useContext(AuthContext)
  const [errored, setErrored] = useState(false)

  const genderOptions = [
    "non_binary",
    "male",
    "female",
    "intersex",
    "transgender",
    "other",
    "intersex",
    "I_prefer_not_to_say",
  ]

  //use3
  useEffect(() => {
    if (!profile) {
      refetch()
      console.log("We refetch", profile)
    }
  }, [])

  const [updateUser, { data: dataUpdate }] = useMutation(
    UPDATE_USER,
    ContextHeader(token)
  )
const [profile, setProfile] = useState(state)
  //Get users data
  // if (loading) return <p>Loading...</p>
  //if (error) return <p>Error, are you already logged in?!</p>

  //console.log("Data Mutation:", dataUpdate)
  //  console.log(state)
  //console.table(data.userSelf)
  console.log("state", state)
  console.log("profile", profile)

  const changeHandler = (e) => {
   setProfile((profile) => ({ ...profile, [e.target.name]: e.target.value }))
  }
  
  /*
  const getValuesFromChild = (values) => {
    console.log("value from child", values)
    //   console.log('State getValuesFromChild: ', state.languages);
  }
  */
  //console.log("STATE.dateOfBirth", state?.dateOfBirth)

  function limitDate(input) {
    const output = input?.substring(0, 10) ?? "Date is unknown"
    return output
  }

  return !token ? (
    <div>You are NOT logged in</div>
  ) : (
    <div id="user-info">
     
     

      <Container>
        <Card.Title className="text-left">{profile?.name}</Card.Title>
        <Form>
          <Row>
            <Col>
              <ProfileImage />
              {errored && (
                <small id="fileUploadError" className="form-text text-muted">
                  something went wrong
                </small>
              )}
            </Col>
            <Col>
              Date of birth
              <FormControl
               
                name="dateOfBirth"
                placeholder="yyyy-mm-dd"
                /*type="date"*/
                type="text"
                value={limitDate(profile?.dateOfBirth)}
                onChange={changeHandler}
                onFocus={(e) => {
                  console.log("Focused on input")
                }}
                onBlur={(e) => {
                  console.log("onBlur")
                }}
              />
              <br />
              {/**/}
              <Dropdown>
                <Dropdown.Toggle
                  size="sm"
                  variant="success"
                  id="dropdown-gender"
                >
                  {profile?.gender}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {genderOptions &&
                    genderOptions.map((selectedGender, index) => {
                      return (
                        <Dropdown.Item
                          name="gender"
                          onClick={(e) => {
                            e.preventDefault()

                            console.log("Gender selected: ", selectedGender)
                            setProfile((profile) => ({
                              ...profile,
                              gender: selectedGender,
                            }))
                          }}
                          key={index + 1}
                        >
                          {
                            selectedGender //?.replace("_", " ")
                          }
                        </Dropdown.Item>
                      )
                    })}
                </Dropdown.Menu>
              </Dropdown>
              <br />
              <Languages />
              <br />
              <IngameRoles />
              {/*  */}
            </Col>{" "}
          </Row>
          <br />

          <Row>
            <Form.Text>About me</Form.Text>
          </Row>
          <Row>
            <Form.Control
              as="textarea"
              rows={3}
              value={profile?.aboutMe}
              id="aboutMe"
               onChange={changeHandler}
             name="aboutMe"
              type="text"
            />
          </Row>

          <br />

          <div>
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.preventDefault()
                updateUser({
                  variables: {
                    aboutMe: profile.aboutMe,
                    gender: profile.gender,
                    languages: profile.languages,
                    dateOfBirth: profile.dateOfBirth,
                    ingameRole: profile.ingameRole,
                  },
                }).catch(() => {
                  setErrored(true)
                })
                alert("Data was updated")
                //get new data after mutation
                // refetch()
              }}
            >
              {" "}
              Save changes{" "}
            </Button>
            {"  "}
            <br />
          </div>
        </Form>
        <br />
      </Container>
    </div>
  )
}

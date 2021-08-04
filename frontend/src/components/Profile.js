import { useContext, useEffect, useState, React, createContext } from "react"
import { GET_MY_INFO } from "../GraphQL/Queries"
import { UPDATE_USER } from "../GraphQL/Mutations"
import { useQuery, useMutation } from "@apollo/client"
import Languages from "./Languages"
import ProfileImage from "./ProfileImage"

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
    if (!state) {
       refetch()
      //setState(data?.userSelf)

      console.log("useEffect3", state)
    }
  }, [])



  const [updateUser, { data: dataUpdate }] = useMutation(
    UPDATE_USER,
    ContextHeader(token)
  )

  //Get users data
  // if (loading) return <p>Loading...</p>
  //if (error) return <p>Error, are you already logged in?!</p>

  //console.log("Data Mutation:", dataUpdate)
  //  console.log(state)
  //console.table(data.userSelf)
  console.log("stateP", state)

  const changeHandler = (e) => {
    e.persist() //important
    setState((state) => ({ ...state, [e.target.name]: e.target.value }))
  }

  const getValuesFromChild = (values) => {
    console.log("value from child", values)
    //   console.log('State getValuesFromChild: ', state.languages);
  }
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
        <Card.Title className="text-left">{state?.name}</Card.Title>
        <Form>
          <Row>
            <Col>
              <ProfileImage setState={setState} state={state} />
              {errored && (
                <small id="fileUploadError" className="form-text text-muted">
                  something went wrong
                </small>
              )}
            </Col>
            <Col>
              Date of birth
              <FormControl
                id="dateOfBirth"
                name="dateOfBirth"
                placeholder="yyyy-mm-dd"
                /*type="date"*/
                type="text"
                value={limitDate(state?.dateOfBirth)}
                onChange={changeHandler}
              />
              <br />
              {/**/}
              <Dropdown>
                <Dropdown.Toggle
                  size="sm"
                  variant="success"
                  id="dropdown-gender"
                >
                  {state?.gender}
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
                            setState((state) => ({
                              ...state,
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
               <Languages
                    getValuesFromChild={getValuesFromChild}
                    state={state}
                    setState={setState}
                  />
                  <br />
                  
                 <IngameRoles
                    getValuesFromChild={getValuesFromChild}
                    state={state}
                    setState={setState}
                  />
                 {/*  */}
            </Col>{" "}
          </Row>
          <br />

          <Row>
            <Form.Text className="text-muted">About me</Form.Text>
          </Row>
          <Row>
            <Form.Control
              as="textarea"
              rows={3}
              value={state?.aboutMe}
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
                    aboutMe: state.aboutMe,
                    gender: state.gender,
                    languages: state.languages,
                    dateOfBirth: state.dateOfBirth,
                    ingameRole: state.ingameRole,
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

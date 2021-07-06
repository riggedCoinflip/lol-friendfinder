import { useEffect, useState, React } from "react"
import { useQuery, gql, useMutation } from "@apollo/client"
import * as Constants from "../constants"
import Languages from "./Languages"
import Friends from "./Friends"

import {
  Button,
  Container,
  Card,
  Form,
  Col,
  Image,
  Row,
  InputGroup,
  FormControl,
  ListGroup,
  Dropdown,
} from "react-bootstrap"

const GET_MY_INFO = gql`
  {
    userSelf {
      _id
      name
      aboutMe
      languages
      gender
      avatar
      ingameRole
      dateOfBirth
      friends {
        user
      }
    }
  }
`

const UPDATE_USER = gql`
  mutation userUpdateSelf($aboutMe: String, $languages: [String]) {
    userUpdateSelf(aboutMe: $aboutMe, languages: $languages) {
      name
      aboutMe
      gender
      languages
      dateOfBirth
      ingameRole
      friends {
        user
      }
      blocked
    }
  }
`

export default function Profile() {
  const [state, setState] = useState({})
  const genderOptions = [
    "non_binary",
    "male",
    "female",
    "intersex",
    "transgender",
    "other",
    "intersex",
    "I prefer not to say",
  ]

  useEffect(() => {
    if (data) {
      refetch()
      setState(data.userSelf)
      console.log("State from useEffect", state)
    }
  }, [])

  const { loading, error, data, refetch } = useQuery(GET_MY_INFO, {
    context: {
      headers: {
        "x-auth-token": Constants.AUTH_TOKEN,
      },
    },
  })

  const [updateUser, { data: dataUpdate }] = useMutation(UPDATE_USER, {
    context: {
      headers: {
        "x-auth-token": Constants.AUTH_TOKEN,
      },
    },
  })

  //Get users data
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error!</p>

  console.log("Data Mutation:", dataUpdate)
  console.log("Data Query:", data)

  const changeHandler = (e) => {
    e.persist() //important
    setState((state) => ({ ...state, [e.target.name]: e.target.value }))
  }

  const getValuesFromChild = (values) => {
    console.log("value from child", values)
    //   console.log('State getValuesFromChild: ', state.languages);
  }
  console.log("STATE.dateOfBirth", state?.dateOfBirth)

  function limitDate(input) {
    const output = input?.substring(0, 10) ?? "Dateis unknown"
    return output
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
                  value={state?.name}
                  onChange={changeHandler}
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
              </InputGroup>
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
                          {selectedGender}
                        </Dropdown.Item>
                      )
                    })}
                </Dropdown.Menu>
              </Dropdown>
              Date of birth
              <FormControl
                placeholder="day/month/year"
                /*type="date"*/
                aria-label="dateOfBith"
                aria-describedby="basic-addon1"
                value={limitDate(state?.dateOfBirth)}
              />
              IngameRole
              <ListGroup horizontal>
                {state?.ingameRole ? (
                  state?.ingameRole &&
                  state?.ingameRole.map((data, index) => {
                    return (
                      <ListGroup.Item variant="dark" key={index + 1}>
                        {data}
                      </ListGroup.Item>
                    )
                  })
                ) : (
                  <p>There're not IngameRole selected</p>
                )}
              </ListGroup>
              <br />
              {/**/}
              <Languages
                getValuesFromChild={getValuesFromChild}
                state={state}
                setState={setState}
              />
              <br />
            </Col>{" "}
          </Row>

          <Row>
            <Form.Text className="text-muted">About me</Form.Text>

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
                  },
                })
                alert("Data was updated")

                //get new data after mutation
                refetch()
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
        Id from your actual friends: (id):
        <Friends data={data} />
      </Container>
    </div>
  )
}

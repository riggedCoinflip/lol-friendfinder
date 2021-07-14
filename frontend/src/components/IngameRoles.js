import { React, useState, useEffect } from "react"
import { useQuery } from "@apollo/client"
import { Dropdown, ListGroup, Badge } from "react-bootstrap"
import { ContextHeader } from "../constants"

export default function IngameRoles(props) {
  const ingameRolesOptions = [
    "Top","Jungle", "Mid", "Bot", "Support", "Fill"
  ]
  const [ingameRoles, setIngameRoles] = useState(props?.state?.ingameRole)
  const [selectedRole, setSelectedRole] = useState(ingameRolesOptions)
  /*
  useEffect(() => {
    //setLocal_Languages(props?.state?.languages)
    //console.log("useEffect []: ", local_Languages)
  }, [props?.state?.gender])

  useEffect(() => {
    //console.log("useEffect [local_Languages]: ", local_Languages)
    props.setState((state) => ({ ...state, languages: local_Languages }))
   // console.log("props.state.languages: ", props.state.languages)
  }, [local_Languages])
*/

  return (
    <div id="avaliableIngameRoles">
      <Dropdown>
      <Dropdown.Toggle size="sm" variant="success" id="dropdown-languages">
      IngameRoles
        </Dropdown.Toggle> 
       
        <Dropdown.Menu>
      {ingameRolesOptions &&
                    ingameRolesOptions.map((selectedRole, index) => {
                      return (
                        <Dropdown.Item
                          name="optionsRole"
                          onClick={(e) => {
                            e.preventDefault()

                           // console.log("Gender selected: ", selectedGender)
                            setSelectedRole((selectedRole) => ({
                              ...selectedRole,
                              selectedRole: selectedRole,
                            }))
                          }}
                          key={index + 1}
                        >
                          {
                            selectedRole //?.replace("_", " ")
                          }
                        </Dropdown.Item>
                      )
                    })} 
       
       </Dropdown.Menu>
      </Dropdown>
      <br /> 

        <ListGroup horizontal>
          {ingameRoles ? (
            ingameRoles.map((item, index) => {
              return (
                <ListGroup.Item
                  name="spoken-language"
                  value={item}
                  variant="dark"
                  key={index + 1}
                >
                  {item}

                  <Badge pill variant="danger">
                    X
                  </Badge>
                </ListGroup.Item>
              )
            })
          ) : (
            <p>There're not IngameRole selected</p>
          )}
        </ListGroup>
      
    </div>
  )
}

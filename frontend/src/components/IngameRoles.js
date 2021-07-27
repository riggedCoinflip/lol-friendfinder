import { React, useState, useEffect } from "react"
import { Dropdown, ListGroup, Badge } from "react-bootstrap"
import { ContextHeader } from "../constants"

export default function IngameRoles(props) {
  const ingameRoleOptions = ["Top", "Jungle", "Mid", "Bot", "Support", "Fill"]
  const [ingameRole, setIngameRole] = useState()
  // const [selectedRole, setSelectedRole] = useState(ingameRolesOptions)

  useEffect(() => {
    setIngameRole(props?.state?.ingameRole)
    //console.log("useEffect []: ", local_Languages)
  }, [props?.state?.ingameRole])

  useEffect(() => {
    //console.log("useEffect [local_Languages]: ", local_Languages)
    props.setState((state) => ({ ...state, ingameRole: ingameRole }))
    console.log("ingameRoles: ", ingameRole)
  }, [ingameRole])

  return (
    <div id="avaliableIngameRoles">
      <Dropdown>
        <Dropdown.Toggle size="sm" variant="success" id="dropdown-languages">
          IngameRole
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {ingameRoleOptions &&
            ingameRoleOptions.map((item, index) => {
              return (
                <Dropdown.Item
                  onClick={(e) => {
                    e.preventDefault()

                    setIngameRole((ingameRoles) => [...ingameRole, item])
                  //  props.setState((state) => ({ ...state, ingameRole: ingameRole }))
                  }}
                  key={index + 1}
                >
                  {item}
                </Dropdown.Item>
              )
            })}
        </Dropdown.Menu>
      </Dropdown>
      <br />

      <ListGroup horizontal>
        {ingameRole ? (
          ingameRole.map((item, index) => {
            return (
              <ListGroup.Item
                name="ingame-roles"
                value={item}
                variant="dark"
                key={index + 1}
              >
                {item}

                <Badge pill variant="danger"
                onClick={(e) => {
                  e.preventDefault()
                  const ingameRoleToDelete =
                    e.target.parentElement.getAttribute("value")
                
                  setIngameRole(
                    ingameRole.filter(
                      (item) => item !== ingameRoleToDelete
                    )
                  )
                  console.log('Deleting ingameRole: ', ingameRoleToDelete)
                }}
                >
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

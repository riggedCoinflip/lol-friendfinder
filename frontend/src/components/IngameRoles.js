import { React, useState, useEffect, useContext } from "react"
import { Dropdown, ListGroup, Badge } from "react-bootstrap"
import { ContextHeader } from "../constants"
import { AuthContext } from "../App"

export default function IngameRoles() {
  const { state, setState } = useContext(AuthContext)

  const ingameRoleOptions = ["Top", "Jungle", "Mid", "Bot", "Support", "Fill"]
  //const [ingameRole, setIngameRole] = useState()
  // const [selectedRole, setSelectedRole] = useState(ingameRolesOptions)

  /*
  useEffect(() => {
   // setIngameRole(state?.ingameRole)
        setState((state) => ({ ...state, ingameRole: ingameRole }))

    //console.log("useEffect []: ", local_Languages)
  }, [state?.ingameRole])


  useEffect(() => {
    //console.log("useEffect [local_Languages]: ", local_Languages)
    setState((state) => ({ ...state, ingameRole: ingameRole }))
    console.log("ingameRoles: ", state.ingameRole)
  }, [ingameRole])
*/
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
                    setState((state) => ({ ...state, ingameRole: [...state.ingameRole, item] }))

                    // setIngameRole((ingameRoles) => [...ingameRole, item])
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
        {state?.ingameRole ? (
          state?.ingameRole.map((item, index) => {
            return (
              <ListGroup.Item
                name="ingame-roles"
                value={item}
                variant="dark"
                key={index + 1}
              >
                {item}

                <Badge
                  pill
                  variant="danger"
                  onClick={(e) => {
                    e.preventDefault()
                    const ingameRoleToDelete =
                      e.target.parentElement.getAttribute("value")
                    setState((state) => ({
                      ...state,
                      ingameRole: state.ingameRole.filter(
                        (item) => item !== ingameRoleToDelete
                      ),
                    }))

                   /* setIngameRole(
                      ingameRole.filter((item) => item !== ingameRoleToDelete)
                    )
                    */
                    console.log("Deleting ingameRole: ", ingameRoleToDelete)
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

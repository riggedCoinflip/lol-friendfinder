import { React, useContext } from "react"
import { Dropdown, ListGroup, Badge } from "react-bootstrap"
import { GlobalContext } from "../App"

export default function IngameRoles() {
  const { state, setState } = useContext(GlobalContext)

  const ingameRoleOptions = ["Top", "Jungle", "Mid", "Bot", "Support", "Fill"]

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
                    setState((state) => ({
                      ...state,
                      ingameRole: [...state.ingameRole, item],
                    }))

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

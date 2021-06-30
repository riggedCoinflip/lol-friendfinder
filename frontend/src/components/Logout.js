import React from "react"
import { useHistory } from "react-router-dom"

export default function Logout() {
  var clearTokenUndOthers = () => {
    localStorage.clear()
  }

  return (
    <div>
      {clearTokenUndOthers()}
      {setTimeout(useHistory().push("/login"), 3000)}
      You just loggout, see you soon.
    </div>
  )
}

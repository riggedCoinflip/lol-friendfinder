import React, { Component } from "react"

export default class Home extends Component {
  render() {
    return (
      <>
        <h2>Wich server are you using?... </h2>
        {process.env.REACT_APP_HOST || "no HOST defined"}
        <br />

Information about this App...
      </>
    )
  }
}

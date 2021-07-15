import React, { Component } from "react"

export default class Home extends Component {
  render() {
    return (
      <>
        <h2>Home... </h2>
        {process.env.REACT_APP_HOST || "no HOST defined"}
      </>
    )
  }
}

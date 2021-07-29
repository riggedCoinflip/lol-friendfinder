import { useContext, useEffect, useState, React } from "react"
import { GET_MY_INFO } from "../GraphQL/Queries"
import { UPDATE_USER } from "../GraphQL/Mutations"
import { useQuery, useMutation } from "@apollo/client"

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

export default function Chat() {
  const { token } = useContext(AuthContext)
  const [state, setState] = useState({})
  const [errored, setErrored] = useState(false)


  const { loading, error, data, refetch } = useQuery(
    GET_MY_INFO,
    ContextHeader(token),
    { pollInterval: 100 }
  )

  useEffect(() => {
    if (data || !state) {
      //  refetch()
      setState(data?.userSelf)

      console.log("State from useEffect", state)
    }
  }, [data])

  useEffect(() => {
    if (token) {
      refetch()
      setState(data?.userSelf)
    }

    // setState(data?.userSelf)
  }, [token])
  console.log(data)
  //If F5

  const [updateUser, { data: dataUpdate }] = useMutation(
    UPDATE_USER,
    ContextHeader(token)
  )

  //Get users data
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error, are you already logged in?!</p>

  //console.log("Data Mutation:", dataUpdate)
  console.table(data.userSelf)

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
     
      Chat...
    </div>
  )
}

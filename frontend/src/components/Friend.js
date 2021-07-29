import { useContext, useState, useEffect, React } from "react"
import { GET_MY_INFO, GET_USER_BY_ID } from "../GraphQL/Queries"
import { useQuery } from "@apollo/client"
import { ContextHeader } from "../constants"
import { ListGroup } from "react-bootstrap"
import FriendCard from "./FriendCard"
import { AuthContext } from "../App"

export default function Friend({ id }) {
    const { loading, error, data } = useQuery(GET_USER_BY_ID, {
      variables: { id },
    });
  
    if (loading) return null;
    if (error) return `Error! ${error}`;
  
    return (
      <img src={data.userOneById.avatar} style={{ height: 100, width: 100 }} />
    );
  }
  
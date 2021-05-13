
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { gql, useApolloClient, useMutation } from "@apollo/client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import * as validateSignup from "../shared/util/validateSignup"


//TODO hash password server side
/*Hier sind alle Verifikationen deaktiviert*/


function Signup() {
    let name, password, email;
    const [addTodo, { data }] = useMutation(USER_CREATE);

    return (
        <div>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    addTodo({ variables: { email, password, name, } });/*
          .catch((res) => {
            const errors = res.graphQLErrors.map((error) => {
              return error.message;
            });
*/

                    //  this.setState({ errors });
                    //   });;
                    name.value = '';
                    email.value = '';
                    password.value = '';
                }}



            >
                <p>name-email-pass</p>
                <input
                    ref={node => { name = node; }}
                    type="text"

                />
                <input

                    ref={node => { email = node; }}
                    type="e"
                    placeholder="Your email address"
                />

                <input
                    ref={node => { password = node; }}
                    type="password"
                    placeholder="Choose a safe password"
                />


                <button type="submit">Signup</button>
            </form>
        </div>
    );
}

const USER_CREATE = gql` 

   mutation signup( $name: String!, $email: String!, $password: String! ) {
        signup(
            
            name: $name, 
            email: $email, 
            password: $password 
        
        ) {
         
            record {
                name
                email
                password
    }

  }
}
`;

export default Signup;

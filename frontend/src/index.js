import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import {ApolloClient, InMemoryCache} from '@apollo/client';
import {ApolloProvider} from '@apollo/client/react';
import './main.scss';
import App from './App';
import { onError } from 'apollo-link-error';

function getURI () {
    return "https://lol-friendfinder.herokuapp.com/graphql" //TODO fix
    //console.log(process.env.HOST || "http://localhost:5000/graphql")
    //return process.env.HOST || "http://localhost:5000/graphql"
}

const client = new ApolloClient({
    uri: getURI(),
    cache: new InMemoryCache({
      typePolicies: {
        User: {
          keyFields: ["email"],
        }
      },
    }),
    onError: ({ networkError, graphQLErrors }) => {
        console.log('graphQLErrors', graphQLErrors)
        console.log('networkError', networkError)

}});
const link = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    if (networkError) console.log(`[Network error]: ${networkError}`);
  });
render(
    <Router>
        <ApolloProvider client={client}>
            <App/>
        </ApolloProvider>
    </Router>,
    document.getElementById('root')
);


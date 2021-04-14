import React from 'react';
import ApolloClient from 'apollo-boost'; //connect with our server which is running at backend
import {ApolloProvider} from 'react-apollo'; // Connect react with apollo.

import './App.css';
import UserList from './components/UserList';

//Using ApolloClient to connect with server
const client = new ApolloClient({
    uri: "http://localhost:5000/graphql"
});

function App() {
    return (
        <ApolloProvider client={client}>
            <div className="App">
                <h1>List of Users</h1>
                <UserList></UserList>
            </div>
        </ApolloProvider>
    );
}

export default App;

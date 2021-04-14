import React from 'react';
import {graphql} from 'react-apollo';
import getUsersQuery from '../queries/queries';

const UserList = props => {
    console.log(props); //check in the browser to see this values.

    const displayUsers = () => {
        let data = props.data;
        if (data.loading) {
            return <div>Loading Users...</div>;
        } else {
            return data.userMany.map(user => {
                return <li key={user.name}>{user.name}</li>;
            });
        }
    };

    return (
        <>
            <ul id="carList">{displayUsers()}</ul>
        </>
    );
};

export default graphql(getUsersQuery)(UserList)
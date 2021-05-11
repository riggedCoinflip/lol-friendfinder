import React from 'react';
import {useQuery, gql} from '@apollo/client';
import {Redirect} from 'react-router-dom';



const GET_USERS = gql`
    query GetUsers{
        userMany {
            name,
            email
        }
    }
`;


//TODO this component is only used for testing. delete on prod
export default function Users({ authorized }) {

  

    const {loading, error, data} = useQuery(GET_USERS);
    //Is the user authorized/logged in? 
    if (!authorized) {
        alert("please login to see the other users ;)");
        return <Redirect to="/" />;
        }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return <div className="Users">
        <h1>List of Users</h1>
        <table className="table table-striped">

            <thead>
            <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
            </tr>
            </thead>
            <tbody>
            {data.userMany.map(({name, email}) => (
                <tr key={name}>
                    <td>{name}</td>
                    <td>{email}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>

}
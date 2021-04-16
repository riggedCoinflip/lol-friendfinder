import React from 'react';
import {useQuery, gql} from '@apollo/client';

const USERS = gql`
    query GetUsers{
        userMany {
            name,
            email
        }
    }
`;

function Users() {
    const {loading, error, data} = useQuery(USERS);

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

export default Users
import {gql} from 'apollo-boost';

const getUsersQuery = gql`
    {
        userMany {
            name
        }
    }
`;

export default getUsersQuery;
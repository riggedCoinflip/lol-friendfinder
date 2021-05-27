const SIGNUP = `
    mutation signUp($name: String!, $email: String!, $password: String!){
        signup(
            record: {name: $name, email:  $email, password: $password}
        ) {
            record {
                name
                email
            }
        }
    }
`

const LOGIN = `
    mutation login($email: String!, $password: String!){
        login(email: $email, password: $password)
    }
`

const USER_SELF = `
    query {
        userSelf{
        name
        aboutMe
        languages
        gender
        age
        avatar
        ingameRole
        }
    }
`

const USER_ONE_ADMIN = `
    query {
        userOneAdmin(filter: {nameNormalized: "name"}) {
            _id
            name
            nameNormalized
            email
            password
            role
            aboutMe
            languages
            gender
            dateOfBirth
            avatar
            ingameRole
            age
            createdAt
            updatedAt
        }
    }
`

module.exports = {
    SIGNUP,
    LOGIN,
    USER_SELF,
    USER_ONE_ADMIN,
}
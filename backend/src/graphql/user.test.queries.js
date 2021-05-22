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

module.exports = {
    SIGNUP
}
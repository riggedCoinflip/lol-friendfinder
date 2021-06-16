const SIGNUP = `
    mutation signup($name: String!, $email: String!, $password: String!){
        signup(
            name: $name, email:  $email, password: $password
        ) {
            name
            email
        }
    }
`

const LOGIN = `
    query login($email: String!, $password: String!) {
        login(email: $email, password: $password)
    }
`
const USER_SELF = `
    query {
        userSelf{
        name
        email
        aboutMe
        languages
        gender
        dateOfBirth
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

const USER_ONE_BY_NAME = `
    query userOneByName($nameNormalized: String!) {
        userOneByName(nameNormalized: $nameNormalized) {
            _id
            name
            aboutMe
            languages
            gender
            avatar
            ingameRole
        }
    }
`

const USER_MANY_LIKES_ME = `
    query userManyLikesMe {
        userManyLikesMe {
            name
            aboutMe
            languages
            gender
            avatar
            ingameRole
        }
    }
`

const USER_UPDATE_SELF = `
    mutation userUpdateSelf($record: UpdateByIdUserPrivateInput!) {
        userUpdateSelf(record: $record) {
            record {
                name
                aboutMe
            }
        }
    }
`

const USER_UPDATE_SELF_BLOCK = `
    mutation userUpdateSelfBlock($_id: MongoID){
        userUpdateSelfBlock(_id: $_id) {
            blocked
        }
    }
`


module.exports = {
    SIGNUP,
    LOGIN,
    USER_SELF,
    USER_ONE_ADMIN,
    USER_ONE_BY_NAME,
    USER_MANY_LIKES_ME,
    USER_UPDATE_SELF,
    USER_UPDATE_SELF_BLOCK,
}
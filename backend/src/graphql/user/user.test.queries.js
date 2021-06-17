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
    mutation userUpdateSelf(
        $name: String
        $aboutMe: String
        $gender: EnumUserPrivateGender
        $languages: [String]
        $dateOfBirth: Date
        $ingameRole: [EnumUserPrivateIngameRole]
        $friends: UserPrivateFriendsMutation
        $blocked: UserPrivateBlockedMutation
    ) {
        userUpdateSelf(
            name: $name
            aboutMe: $aboutMe
            gender: $gender
            languages: $languages
            dateOfBirth: $dateOfBirth
            ingameRole: $ingameRole
            friends: $friends
            blocked: $blocked
        ) {
            name
            aboutMe
            gender
            languages
            dateOfBirth
            ingameRole
            friends {user}
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
}
import { gql } from "@apollo/client"

export const LOGIN = gql`
  query login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`
export const GET_MY_INFO = gql`
  {
    userSelf {
      _id
      name
      aboutMe
      languages
      gender
      avatar
      ingameRole
      dateOfBirth
      friends {
        user
      }
      blocked
    }
  }
`

export const GET_USER_TO_SWIPE = gql`
  {
    userManyToSwipe {
      name
      age
      languages
      ingameRole
      _id
      gender
      aboutMe
      avatar
    }
  }
`

export const GET_LANGUAGES = gql`
  {
    languageMany(filter: {}) {
      name
      alpha2
      nativeName
    }
  }
`

export const GET_USER_BY_ID = gql`
  query userOneById($userId: MongoID!) {
    userOneById(_id: $userId) {
      _id
      name
      languages
      gender
      avatar
      age
      languages
    }
  }
`

import { gql } from "@apollo/client"

export const USER_CREATE = gql`
mutation signup(
  $name: String!
  $email: String!
  $password: String! 
) {
  signup(name: $name, email: $email, password: $password) {
    name
    email
  }
}
`

export const UPDATE_USER = gql`
  mutation userUpdateSelf(
    $aboutMe: String
    $languages: [String]
    $dateOfBirth: Date
    $gender: EnumUserPrivateGender
    $blocked: UserPrivateBlockedMutation
    $ingameRole: [EnumUserPrivateIngameRole]
  ) {
    userUpdateSelf(
      aboutMe: $aboutMe
      languages: $languages
      dateOfBirth: $dateOfBirth
      gender: $gender
      blocked: $blocked
      ingameRole: $ingameRole

    ) {
      name
      aboutMe
      gender
      languages
      dateOfBirth
      ingameRole
      friends {
        user
      }
      blocked
    }
  }
`

export const SWIPE_USER = gql`
mutation 
    swipe (
			$recipient: MongoID
        $status: String!
    )
  {
    swipe
  (    record: {
            recipient:  $recipient
            status:  $status
        }) {
        record{
            requester
            recipient
            status
        }
    }
}
`



export const SEND_MESSAGE = gql`
mutation sendMessage(
$chatID: MongoID!
$content: String!
)
  {
    sendMessage(
        chatID: $chatID
        content: $content
    )
}
`



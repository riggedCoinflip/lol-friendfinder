import { gql } from "@apollo/client"

export const UPDATE_USER = gql`
  mutation userUpdateSelf(
    $aboutMe: String
    $languages: [String]
    $dateOfBirth: Date
    $gender: EnumUserPrivateGender
    $blocked: UserPrivateBlockedMutation
  ) {
    userUpdateSelf(
      aboutMe: $aboutMe
      languages: $languages
      dateOfBirth: $dateOfBirth
      gender: $gender
      blocked: $blocked
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
`;
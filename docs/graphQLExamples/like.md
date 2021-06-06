# Like

## Mutations

### Swipe

Like or dislike another user.

```graphql
mutation {
    swipe (
        record: {
            recipient: _userid_
            status: "liked"
        }) {
        record{
            requester
            recipient
            status
        }
    }
}
```

The ``record.requester`` field gets overriden in the request - we only want to allow the current user to like sb.
```graphql
mutation {
    swipe (
        record: {
            requester: foo #would usually throw an error as id doesnt exist
            recipient: _userid_
            status: "disliked"
        }) {
        record{
            requester
            recipient
            status
        }
    }
}
```

## Get a match

For a match to happen, both users have to like each other.  
Hint: Neeko likes everyone - you can use her as User2 to skip some of the steps.

1. Get the id of User1 (for example with a `user` query)
2. Get the id of User2
3. Login as User1
4. Do a swipe with ``status = liked`` and `recipient = User2ID`
5. Login as User2
6. Do a swipe with ``status = liked`` and `recipient = User1ID`
7. Do a userSelf query with `friends { user }`
8. You should now see the UserID of User1
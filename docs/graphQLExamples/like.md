# Like

## Mutations

### Swipe

Likes or dislikes another user.

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
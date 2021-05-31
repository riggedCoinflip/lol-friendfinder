# User

#### Create a user

```graphql
mutation {
    signup(
        record: {
            name: "someValidName",
            email: "someValid@mail",
            password: "Password1"
        }) {
        record {
            name
            email
            password
        }
    }
}
```

#### Get a JWT by logging in

```graphql
mutation {
    login(email: "some@email", password: "yourPassword")
}
```

## require JWT

#### Get information about yourself

```graphql
{
    userSelf {
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
```

## require admin role

#### Find a user with name "admin"

```graphql
{
    userOneAdmin(filter: { name: "Admin" }) {
        name
        nameNormalized
        email
        password
        role
        aboutMe
        languages
        gender
        dateOfBirth
        age
        avatar
        ingameRole
        updatedAt
        createdAt
    }
}
```

#### Show all admins
_note: enums should be written without the `""` around the String. Replace whitespace inside the String with `_`_

```graphql
{
    userManyAdmin(filter: { role:admin }) {
        name
        email
    }
}
```

#### Create a user with non-default fields

```graphql
mutation {
    userCreateOneAdmin(
        record: {
            name: "JohnDoe5"
            email: "JohnDoe5@gmail.com"
            password: "Password1"
            role: user
            aboutMe: "Some Lorem Ipsum Text"
            dateOfBirth: "01.10.00"
            languages: ["de", "fr"]
            gender: I_prefer_not_to_say
            avatar: "this should be a URL"
            ingameRole: [Top, Jungle]
        }
    ) {
        record {
            name
            email
            password
            dateOfBirth
            age
            role
            aboutMe
            languages
            gender
            avatar
            ingameRole
        }
    }
}
```

#### Update a single user.   
FIXME this sometimes does not work cause it tries to update the password - same error like in the inconsistent test

```graphql
mutation {
  userUpdateOneAdmin(
    record: { 
        ingameRole: [Mid, Fill]
        avatar: "foobar" 
    }
    filter: { 
        name: "Admin" 
    }
  ) {
    record {
      name
      avatar
      ingameRole
    }
  }
}
```
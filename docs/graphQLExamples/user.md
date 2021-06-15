# User

### Get public information about any User by ID/Name

````graphql
{
    userOneByName(nameNormalized: "admin")
    {
        _id
        name
        languages
    }
}
````

````graphql
{
    userOneById(_id: "60c3854f707d802c1c7e92d9")
    {
        _id
        name
        languages
    }
}
````

### Show all users that fall into a certain filter

````graphql
{
    userMany(filter: {_operators: {languages: {in: "de"}}}) {
        name
        age
        languages
    }
}
````

````graphql
{
    userMany(filter: {_operators: {age: {gte: 20 lte: 25}}}) {
        name
        age
        languages
    }
}

````

### Create a user

```graphql
mutation {
    signup(
        record: {
            name: "someValidName"
            email: "someValid@mail"
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

### Get a JWT by logging in

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
        _id
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

### Show every user that likes you

````graphql
{
    userManyLikesMe {
        name
    }
}
````

## require admin role

#### Find a user with name "admin"

```graphql
{
    userOneAdmin(filter: { name: "Admin" }) {
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
        age
        avatar
        ingameRole
        updatedAt
        createdAt
        friends {
            user
        }
        blocked
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
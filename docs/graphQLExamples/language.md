# Language

## Queries

### languageMany

get all (limited to first 100) languages:
```graphql
{
  languageMany(filter: {}) {
    alpha2
    name
    nativeName
  }
}
```

### languageOne

Get Alpha-2 code of german (not germanY - we have languages not countries):
```graphql
{
  languageOne(filter: {name: "German"}) {
    alpha2
  }
}
```
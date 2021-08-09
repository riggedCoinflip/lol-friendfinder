export const TOKEN = localStorage.getItem("SECREToken") || null

export const ContextHeader = (TOKEN) => {
  //console.log("getting the token", TOKEN)
  return {
    context: {
      headers: {
        "x-auth-token": TOKEN,
      },
    },
  }
}

export const Headers = (TOKEN) => {
 // console.log("getting the token", TOKEN)
  return {
    headers: {
      "x-auth-token": TOKEN,
    },
  }
}

export const TOKEN =   localStorage.getItem("SECREToken") || null ;
export const ContextHeader = {
    context: {
      headers: {
        "x-auth-token": TOKEN,
      },
    },
  }

//console.log('from constants: '+ AUTH_TOKEN);
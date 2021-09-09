//TODO; header and file to upload are missing


import * as c from "../constants.js";
//const urlAvatar = process.env.REACT_APP_HOST.slice(0, -8) + `/api/avatar`
const urlAvatar = 'https://lol-friendfinder.herokuapp.com/api/avatar'
const token = localStorage.getItem("SECREToken");
describe('Test the API-Requests', () => {   
    it('Login with specific account', () => {
        cy.typeLogin(c.email, c.password)
    })
   
    it('Test the POST-Request responsable to upload pictures', () => {
        cy.get('#aboutMe').type(token)


        cy.intercept({
            method: 'POST',
            url: urlAvatar,
            headers: {
                "x-auth-token": token,
              },
          //  VALUE: token,
        //    KEY: 'x-auth-token',
          }).as('apiCheck')

          cy.wait('@apiCheck').should('have.property', 'response.statusCode', 200)

    })

})
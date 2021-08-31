import * as c from "../constants.js";
var specNumber = 93
var specEmail = `John${specNumber}@mail.de`

describe('Logging with this user', () => {   
    it('Login with specific account', () => {
        cy.typeLogin(specEmail, c.newPassword)
    })

})
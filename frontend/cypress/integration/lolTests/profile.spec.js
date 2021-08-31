import * as c from "../constants.js";

describe('Get data froom DB', () => {
    it('Login with existing account', () => {
        cy.typeLogin(c.email, c.password)
    })

    it('Data from user is there', () => {
    //    cy.visit('/Users')
     //   cy.visit('/profile')
        //cy.wait(2000)

        cy.get('[id=username]')
        .should('have.value', !null)
        
        cy.get('[id=gender]')
        .should('have.value', !null)
        //ToDo undefined?
     })

    })
import * as c from "../constants.js";

describe('Create new User', () => {   

    it('Enters email', () => {
        cy.visit('/signup')
        cy.get('[id=email-input]')
            .type(c.newEmail)
            .should('have.value', c.newEmail)
    })

    it('Enters username', () => {
        cy.get('[id=username-input]')
            .type(c.newName)
            .should('have.value', c.newName)
    })

    it('Enters password', () => {
        cy.get('[id=password-input]')
            .type(c.newPassword)
            .should('have.value', c.newPassword)
    })

    it('Enters password2', () => {
        cy.get('[id=password2-input]')
            .type(c.newPassword)
            .should('have.value', c.newPassword)
            cy.get('[id=btn-submit]').click()

    })
    it('Email ok Pss ok', () => {
        cy.visit('/login')

        cy.get('[id=email-input]')
            .type(c.newEmail)
        cy.get('[id=password-input]')
            .type(c.newPassword)

        cy.get('[id=btn-submit]').click()
    })

})
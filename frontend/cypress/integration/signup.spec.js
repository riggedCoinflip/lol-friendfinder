describe('Signup Fields exist', () => {
    it('Enters email', () => {
        cy.visit('http://localhost:3000/signup')

        cy.get('[id=email-input]')
            .type('fake@email.com')
            .should('have.value', 'fake@email.com')

    })

    it('Enters username', () => {
        cy.get('[id=username-input]')
            .type('JohnDoe')
            .should('have.value', 'JohnDoe')
    })

    it('Enters password', () => {
        cy.get('[id=password-input]')
            .type('Password1')
            .should('have.value', 'Password1')
    })

    it('Enters password2', () => {
        cy.get('[id=password2-input]')
            .type('Password2')
            .should('have.value', 'Password2')
    })
})
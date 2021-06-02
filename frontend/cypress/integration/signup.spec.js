describe('Create new User', () => {
    const email = "john01@mail.de";
    const password = "#Pass123";
    const password2 = "#Pass432";
    const name = "JohnDoe01"
    it('Enters email', () => {
        cy.visit('/signup')
        cy.get('[id=email-input]')
            .type(email)
            .should('have.value', email)

    })

    it('Enters username', () => {
        cy.get('[id=username-input]')
            .type(name)
            .should('have.value', name)
    })

    it('Enters password', () => {
        cy.get('[id=password-input]')
            .type(password)
            .should('have.value', password)
    })

    it('Enters password2', () => {
        cy.get('[id=password2-input]')
            .type(password)
            .should('have.value', password)

            cy.get('[id=btn-submit]').click()

    })
    it('Email ok Pss ok', () => {
        cy.visit('/login')

        cy.get('[id=email-input]')
            .type(email)
        cy.get('[id=password-input]')
            .type(password)

        cy.get('[id=btn-submit]').click()
    })

})
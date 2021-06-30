describe('Get data froom DB', () => {
    const email = "Carlo@in_da_house";
    const password = "Secret!1";
    const name = "gilo2754"
    const gender = "male"

    it('Enters email', () => {
        cy.visit('/login')
        cy.get('[id=email-input]')
            .type(email)
            .should('have.value', email)

    })

    it('Enters password', () => {
        cy.get('[id=password-input]')
            .type(password)
            .should('have.value', password)
    })

    cy.get('[id=btn-submit]').click()    

    it('Data from user is there', () => {
        cy.visit('/Users')
        cy.visit('/profile')

        cy.get('[id=username]')
        .should('have.value', !null)
        
        cy.get('[id=gender]')
        .should('have.value', !null)
        //ToDo undefined?
     })

    })
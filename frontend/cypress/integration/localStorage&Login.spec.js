describe('Values localStage', () => {
   //Variables
   const email = "jose@mail.de";
   const password = "#Pass123";
   
    it('Is LocalStorage null at the beginning', () => {

        cy.clearLocalStorage().should((ls) => {
            expect(ls.getItem('SECREToken')).to.be.null
        })
    })


    it('Email ok Pss fail', () => {
        cy.visit('/login')

        cy.get('[id=email-input]')
            .type(email)
        cy.get('[id=password-input]')
            .type('FalsePassword')

        cy.get('[id=btn-submit]').click()
    })

    it('LocalStorage is still null', () => {

        cy.clearLocalStorage().should((ls) => {
            expect(ls.getItem('SECREToken')).to.be.null
        })
    })

    it('Email ok Pss ok', () => {
        cy.visit('/login')

        cy.get('[id=email-input]')
            .type(email)
        cy.get('[id=password-input]')
            .type(password)

        cy.get('[id=btn-submit]').click()
    })

    it('LocalStorage is different than null', () => {

        cy.clearLocalStorage().should((ls) => {
            expect(ls.getItem('SECREToken')) !== 'null'
        })
    })
})





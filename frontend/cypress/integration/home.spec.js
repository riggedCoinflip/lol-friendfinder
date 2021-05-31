describe('Test for home', () => {
    it('Render correctly', () => {
        cy.visit('http://localhost:3000')
        cy.get("#root").should("exist");

    })

   
})
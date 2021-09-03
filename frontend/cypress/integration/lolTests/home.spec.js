describe('Test for home', () => {
    it('Render correctly', () => {
        cy.visit('/')
        cy.get("#root").should("exist");
    })

   
})
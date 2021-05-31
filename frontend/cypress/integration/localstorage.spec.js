describe('Values localStage', () => {
    it('Is LocalStorage null at the beginning', () => {

        cy.clearLocalStorage().should((ls) => {
            expect(ls.getItem('SECREToken')).to.be.null
            expect(localStorage.getItem('prop3')).to.eq('magenta')

           
                   
         })
        })
    })


    


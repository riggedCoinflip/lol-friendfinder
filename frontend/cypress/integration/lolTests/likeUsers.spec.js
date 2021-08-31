import * as c from "../constants.js"

describe("Like and dislike users", () => {
  it("Login with existing account", () => {
    cy.typeLogin("John75@mail.de", c.newPassword)
  })

  it("Go to Users, save first username", () => {
    cy.contains("Users").click()
    cy.contains("Check").click()

    // Get the first username 
    cy.get("#name").invoke('text').then( userBefore => {
      alert(userBefore)

    //Press like
      cy.get("#liked").click()

    // Get a new username
      cy.get("#name").invoke('text').then( userAfter => {
        alert(userAfter)

        //We expect the usernames are different
      expect (userBefore).not.to.eq(userAfter)
    })
    
  })

 
    })

})

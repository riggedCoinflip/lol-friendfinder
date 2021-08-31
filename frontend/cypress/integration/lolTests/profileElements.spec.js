import * as c from "../constants.js"

describe("Check if all profile elements have been rendered", () => {
  it("Login with existing account", () => {
    cy.typeLogin(c.email, c.password)
  })

  it("Username is there", () => {
    cy.get('#username').should("be.visible")
  })

  it("Gender selection is there", () => {
    cy.get("#avaliableLanguages > .dropdown > #dropdown-languages").should(
      "be.visible")
  })

  it("Language selection is there", () => {
    cy.get("#avaliableLanguages > .dropdown > #dropdown-languages").should(
      "be.visible")
  })

  it("InGameRole selection is there", () => {
    cy.get("#avaliableIngameRoles > .dropdown > #dropdown-languages").should(
      "be.visible")
  })

 it("AboutMe is there", () => {
    cy.get('#aboutMe').should("be.visible")
  })
  
})

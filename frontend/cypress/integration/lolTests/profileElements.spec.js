import * as c from "../constants.js"

const qtyLanguages = 101
const qtyGenders = 8
const qtyInGameRoles = 6

describe("Check if all profile elements have been rendered", () => {
  it("Login with existing account", () => {
    cy.typeLogin(c.email, c.password)
  })

  it("Username was rendered", () => {
    cy.get('#username').should("be.visible")
  })

  it("Gender selection was rendered", () => {
    cy.get('#dropdown-gender').should(
      "be.visible")
  })

it(`Gender options is not empty and >= to ${qtyGenders}`, () => {
  cy.get('#dropdown-gender').click()
  cy.get(`.dropdown-menu > :nth-child(${qtyGenders})`).should(
      "be.visible")
  //close the dropdown
  cy.get('#dropdown-gender').click()

  })

  it("Language selection was rendered", () => {
    cy.get("#avaliableLanguages > .dropdown > #dropdown-languages").should(
      "be.visible")
  })

  it(`Language options is not empty and has at least ${qtyLanguages} options`, () => {
    cy.get("#dropdown-languages").click()
    cy.get(`.dropdown-menu > :nth-child(${qtyLanguages})`).should( "be.visible")
    //close the dropdown
    cy.get("#dropdown-languages").click()
  })

  it("InGameRole selection is there", () => {
    cy.get("#avaliableIngameRoles > .dropdown > #dropdown-ingamerole").should(
      "be.visible")
  })

it(`InGameRole options is not empty and has at least ${qtyInGameRoles} options`, () => {
    cy.get("#dropdown-ingamerole").click()
    cy.get(`#avaliableIngameRoles > .dropdown > .dropdown-menu > :nth-child(${qtyInGameRoles})`).should( "be.visible")
    //close the dropdown
    cy.get("#dropdown-ingamerole").click()
  })

 it("AboutMe was rendered", () => {
    cy.get('#aboutMe').should("be.visible")
  })
  
})

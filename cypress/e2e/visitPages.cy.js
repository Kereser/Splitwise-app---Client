describe('Visit main pages of the app', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  })

  it('visit login page', () => {
    cy.contains('New user?')
  })

  it('visit signup page', () => {
    cy.contains('Sign up').click()
    cy.contains('Create account')
  })
})

describe('Visit Friend page and HomeUser', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
    cy.get('input:first').type('testing')
    cy.get('input:last').type('testing')
    cy.get('button').should('contain', 'Log-in').click()
  })

  it('Can see the dashboard and updates the location', () => {
    cy.get('#close-btn').click()
    cy.contains('Dashboard').click()
    cy.url('Location').should('includes', '/Dashboard')
  })
})
//Pasar este test a otro archivo despues

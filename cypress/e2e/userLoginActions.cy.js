describe('user acctions // Nombre para carpeta', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  })

  it('non valid credentials login', () => {
    cy.get('input:first').type('testing')
    cy.get('input:last').type('testing')
    cy.get('button').should('contain', 'Log-in').click()
    cy.contains('testing successfully logged in')
  })

  describe('Non valid params', () => {
    beforeEach(() => {
      cy.contains('Sign up').click()
    })

    it('Non valid username', () => {
      cy.get('input:first').type('tes')
      cy.contains('Create account').click()
      cy.contains('Username must be at least 4 characters')
    })

    it('Non valid name', () => {
      cy.get('input:first').type('testing')
      cy.get('input:nth-child(2)').type('tes')
      cy.contains('Create account').click()
      cy.contains('Name must be at least 4 characters')
    })

    it('Non valid password', () => {
      cy.get('input:first').type('testing')
      cy.get('input:nth-child(2)').type('testingings')
      cy.get('input:last').type('tes')
      cy.contains('Create account').click()
      cy.contains('Password must be at least 4 characters')
    })

    it('Username can not contain whitespaces', () => {
      cy.get('input:first').type('testing testing')
      cy.get('input:nth-child(2)').type('testingings')
      cy.get('input:last').type('testing')
      cy.contains('Create account').click()
      cy.contains('Non of the fields can contain whitespaces')
    })

    it('Valid credentials', () => {
      cy.get('input:first').type('testing')
      cy.get('input:nth-child(2)').type('testingings')
      cy.get('input:last').type('testing')
      cy.contains('Create account').click()
      cy.contains('Username already register.')
    })
  })
})

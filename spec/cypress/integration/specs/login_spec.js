describe('The Home Page', () => {
  //it('loads successfully', () => {
  //  cy.visit('/')
  //})
  it('logs in', function () {

      //cy.appFixtures()
      const login = 'christian.gregor@googlemail.com'
      const password = 'bla4bla'

      cy.visit('/')
      //cy.wait(2000)
      cy.get('.icon-open').click()
      cy.get('input[name=login]').type(login)

      // {enter} causes the form to submit
      cy.get('input[name=password]').type(`${password}{enter}`)
      cy.url().should('include', 'searches/archive')
      cy.visit('/de/accounts/current')

      // UI should reflect this user being logged in
      cy.get('.details').should('contain', login)

      //cy.visit('de/interviews/cd005')
    })
})

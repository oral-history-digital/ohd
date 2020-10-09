describe('The Home Page', () => {
  //it('loads successfully', () => {
  //  cy.visit('/')
  //})
  it('logs in', function () {

      //cy.appFixtures()
      const login = 'chrgregor@googlemail.com'
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
      cy.get('.icon-open').click()

      // toggle Redaktionsansicht
      cy.get('.switch-label').click()
      cy.get('.flyout').should('contain', 'Verwaltung')
      cy.get('.flyout>li').contains('Suche im Archiv').click()
      cy.get('li>span').contains('Workflow').click()
      cy.get('span').contains('Abramowa').click()
      cy.get('.flyout').not('contain', 'Protokoll')
      // archive view
      cy.visit('/de/accounts/current')
      cy.get('.icon-open').click()
      cy.get('.switch-label').click()
      cy.get('.lang').eq(1).click()
      cy.get('.flyout').not('contain', 'administration')
      cy.visit('en/interviews/za466')
      cy.get('.icon-open').click()
      cy.get('.flyout-sub-tabs-container').should('contain', 'Number of tapes')
    })
})

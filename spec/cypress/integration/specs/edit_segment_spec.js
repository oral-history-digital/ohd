describe('Edit Segment', () => {

    // only run locally!
    it('changes heading', function () {
      const login = 'chrgregor@googlemail.com'
      const password = 'bla4bla'
      cy.visit('/')
      // TODO: ensure that tests are only run locally
      // (maybe put into initializer)
      cy.url().should('eq', 'http://localhost:3000/de')
      cy.get('.icon-open').click()
      cy.get('input[name=login]').type(login)
      cy.get('input[name=password]').type(`${password}{enter}`)
      cy.wait(1000)
      cy.visit('/de/accounts/current')
      cy.get('.icon-open').click()
      cy.get('.switch-label').click() // Administration view

      // variant a) move to edit view via UI
      //cy.get('ul.flyout>li.flyout-tab').first().should('contain', 'Suche im Archiv').click()
      //cy.url().should('include', 'searches/archive')
      //cy.get('div.search-results-container>div.interview-preview.search-result').first().click()
      //cy.get('.icon-close').click()

      // variant b) jump to interview
      cy.visit('en/interviews/za283')
      // click edit heading icon
      cy.get('span.fa-stack.fa-1x').first().click()
      cy.get('input[name=mainheading]').clear()
      cy.get('input[name=mainheading]').type('My first heading')
      cy.get('#segment').submit()
      cy.wait(10000)
      cy.get('span.fa-stack.fa-1x').first().click()
      cy.get('input[name=mainheading]').should('have.value', 'My first heading')
      // cleanup
      cy.get('input[name=mainheading]').clear()
      cy.get('#segment').submit()
  })
})

describe('User Registration', () => {

   // TODO: use fixtures or seeds instead
   let user = {
     "first_name": "Sura",
     "last_name": "Norda",
     "email": "taaest44@deleteme.org",
     "gender": "not_specified",
     "street": "Milchstraße 2",
     "city": "Berlin",
     "zipcode": "10999",
     "country": "DE",
     "comments": "Guten Tag! Ich interessiere mich...",
     "tos_agreement": true,
     "priv_agreement": true
   }

  it('requires privacy agreement', function () {
      user.priv_agreement = false
      cy.visit('/de/user_registrations/new')
      cy.get('input[name=first_name]').type(user.first_name)
      cy.get('input[name=last_name]').type(user.last_name)
      cy.get('input[name=email]').type(user.email)
      cy.get('select[name=gender]').select(user.gender)
      cy.get('input[name=street]').type(user.street)
      cy.get('input[name=zipcode]').type(user.zipcode)
      cy.get('input[name=city]').type(user.city)
      cy.get('select[name=country]').select(user.country)
      cy.get('textarea[name=comments]').type(user.comments)
      cy.get('input[name=tos_agreement]').check()
      cy.get('#user_registration').submit()
      cy.get('div.form-group.has-error > div.form-label > label').should('contain', 'Hinweise zum Datenschutz')
  })

  it('requires tos agreement', function () {
      user.tos_agreement = false
      cy.visit('/de/user_registrations/new')
      cy.get('input[name=first_name]').type(user.first_name)
      cy.get('input[name=last_name]').type(user.last_name)
      cy.get('input[name=email]').type(user.email)
      cy.get('select[name=gender]').select(user.gender)
      cy.get('input[name=street]').type(user.street)
      cy.get('input[name=zipcode]').type(user.zipcode)
      cy.get('input[name=city]').type(user.city)
      cy.get('select[name=country]').select(user.country)
      cy.get('textarea[name=comments]').type(user.comments)
      cy.get('input[name=priv_agreement]').check()
      cy.get('#user_registration').submit()
      cy.get('div.form-group.has-error > div.form-label > label').should('contain', 'Nutzungsbedingungen')
  })
  it('does not allow registration for already registered email address', function () {
      cy.visit('/de/user_registrations/new')
      cy.get('input[name=first_name]').type(user.first_name)
      cy.get('input[name=last_name]').type(user.last_name)
      cy.get('input[name=email]').type(user.email)
      cy.get('select[name=gender]').select(user.gender)
      cy.get('input[name=street]').type(user.street)
      cy.get('input[name=zipcode]').type(user.zipcode)
      cy.get('input[name=city]').type(user.city)
      cy.get('select[name=country]').select(user.country)
      cy.get('textarea[name=comments]').type(user.comments)
      cy.get('input[name=tos_agreement]').check()
      cy.get('input[name=priv_agreement]').check()
      cy.get('#user_registration').submit()
      cy.wait(500)
      cy.get('body').then(($body) => {
         if ($body.text().includes(user.email)) {
           cy.get('.wrapper-page').should('contain', `Eine Registrierung für ${user.email} liegt bereits vor`)
         }
         else { // works only on first run of the test
           cy.get('.wrapper-page').should('contain', `Bitte überprüfen Sie Ihr E-Mail-Postfach und bestätigen Sie Ihre Registrierung mit dem Link in der E-Mail.`)
         }
       })
    })
})

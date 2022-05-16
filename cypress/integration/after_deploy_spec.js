Cypress.Commands.add('checkForHomeText', content => {
    cy.get('.home-text')
      .contains(content);
});

Cypress.Commands.add('goToSearchPage', () => {
    cy.get('.BurgerButton')
      .click();
    cy.contains('Suche im Archiv')
      .click();
});

Cypress.Commands.add('checkForSearchHeading', () => {
    cy.get('.search-results-title')
      .contains('Interviews');
})

describe('ZWAR', () => {
    it('Visits ZWAR production site', () => {
        cy.visit('https://archiv.zwangsarbeit-archiv.de/de');

        cy.checkForHomeText('Zwangsarbeit 1939-1945');

        cy.goToSearchPage();

        cy.url().should('include', '/searches/archive?order=asc&sort=title');
        cy.checkForSearchHeading();
    });

    it('Visits ZWAR staging site', () => {
        cy.visit('http://da03.cedis.fu-berlin.de:84/de');

        cy.get('.home-text')
          .contains('Zwangsarbeit 1939-1945');

        cy.goToSearchPage();

        cy.url().should('include', '/searches/archive?order=asc&sort=title');
        cy.checkForSearchHeading();
    });
});

describe('CDOH', () => {
    it('Visits CDOH production site', () => {
        cy.visit('https://archiv.cdoh.net/de');

        cy.checkForHomeText('Colonia Dignidad. Ein chilenisch-deutsches Oral History-Archiv');

        cy.goToSearchPage();

        cy.url().should('include', '/searches/archive?sort=random');
        cy.checkForSearchHeading();
    });
});

describe('OHD', () => {
    it('Visits OHD production site', () => {
        cy.visit('https://portal.oral-history.digital/de', {
            auth: {
                username: Cypress.env('ohdProdUsername'),
                password: Cypress.env('ohdProdPassword'),
            },
        });

        cy.goToSearchPage();

        cy.url().should('include', '/searches/archive?order=asc&sort=title');
        cy.checkForSearchHeading();
    });

    it('Visits OHD staging site', () => {
        cy.visit('https://test.oral-history.digital/de', {
            auth: {
                username: Cypress.env('ohdStageUsername'),
                password: Cypress.env('ohdStagePassword'),
            },
        });

        cy.goToSearchPage();

        cy.url().should('include', '/searches/archive?order=asc&sort=title');
        cy.checkForSearchHeading();
    });
});

describe('MOG', () => {
    it('Visits MOG production site', () => {
        cy.visit('https://archive.occupation-memories.org/de');

        cy.checkForHomeText('Erinnerungen an die Okkupation in Griechenland');

        cy.goToSearchPage();

        cy.url().should('include', '/searches/archive?order=asc&sort=title');
        cy.checkForSearchHeading();
    });

    it('Visits MOG staging site', () => {
        cy.visit('http://da03.cedis.fu-berlin.de:91/de');

        cy.get('.home-text')
          .contains('Erinnerungen an die Okkupation in Griechenland');

        cy.goToSearchPage();

        cy.url().should('include', '/searches/archive?order=asc&sort=title');
        cy.checkForSearchHeading();
    });
});

describe('Deutsches Gedächtnis', () => {
    it('Visits DG production site', () => {
        cy.visit('https://deutsches-gedaechtnis.fernuni-hagen.de/de');

        cy.checkForHomeText('Deutsches Gedächtnis');

        cy.goToSearchPage();

        cy.url().should('include', '/searches/archive?order=asc&sort=title');
        cy.checkForSearchHeading();
    });
});

describe('Eiserner Vorhang', () => {
    it('Visits EV production site', () => {
        cy.visit('https://archiv.eiserner-vorhang.de/de', {
            auth: {
                username: Cypress.env('evProdUsername'),
                password: Cypress.env('evProdPassword'),
            },
        });

        cy.checkForHomeText('Interview-Archiv "Eiserner Vorhang"');

        cy.goToSearchPage();

        cy.url().should('include', '/searches/archive?order=asc&sort=title');
        cy.checkForSearchHeading();
    });
});

describe('Erlebte Geschichte', () => {
    it('Visits EG staging site', () => {
        cy.visit('http://da03.cedis.fu-berlin.de:89/de', {
            auth: {
                username: Cypress.env('egStageUsername'),
                password: Cypress.env('egStagePassword'),
            },
        });

        cy.checkForHomeText('Erlebte Geschichte');

        cy.goToSearchPage();

        cy.url().should('include', '/searches/archive?order=asc&sort=title');
        cy.checkForSearchHeading();
    });
});

describe('Campscapes', () => {
    it('Visits Campscapes production site', () => {
        cy.visit('http://testimonies.campscapes.org/en');

        cy.checkForHomeText('Campscapes Testimonies');

        cy.get('.BurgerButton')
          .click();
        cy.contains('I agree to the Terms of Use.')
          .click();

        cy.url().should('include', '/searches/archive?order=asc&sort=title');
        cy.checkForSearchHeading();
    });
});

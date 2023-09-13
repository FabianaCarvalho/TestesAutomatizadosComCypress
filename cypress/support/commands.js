Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function () {
    cy.get('#firstName').type('Fabiana')
    cy.get('#lastName').type('Carvalho')
    cy.get('#email').type('fabiana@gmail.com')
    cy.get('#open-text-area').type('TesteFabi')
    cy.contains('button', 'Enviar').click()


})
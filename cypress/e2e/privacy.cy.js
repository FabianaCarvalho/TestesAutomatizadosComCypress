Cypress._.times(5, function(){
    it('Testa a página da politica de privacidade de forma independete', function(){
        cy.visit('./src/privacy.html')
    
        cy.contains('Talking About Testing').should('be.visible')
    })
})
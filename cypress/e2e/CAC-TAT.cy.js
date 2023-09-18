/// <reference types="Cypress" />


describe('Central de Atendimento ao Cliente TAT', function () {
  const THREE_SECONDS_IN_MS = 3000
  beforeEach(function () {
    cy.visit('./src/index.html')
  })

  it('verifica o título da aplicação', function () {
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
  })

  it('preenche os campos obrigatórios e envia o formulário', function () {
    //const longText = 'Teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste'
    const longText = Cypress._.repeat('testeFabi', 20)
    cy.clock()

    cy.get('#firstName').type('Fabiana')
    cy.get('#lastName').type('Carvalho')
    cy.get('#email').type('fabiana@gmail.com')
    cy.get('#open-text-area').type(longText, { delay: 0 })
    cy.contains('button', 'Enviar').click()

    cy.get('.success').should('be.visible')
    cy.tick(THREE_SECONDS_IN_MS)
    cy.get('.success').should('not.be.visible')
  })

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação', function () {

    cy.clock()

    cy.get('#firstName').type('Fabiana')
    cy.get('#lastName').type('Carvalho')
    cy.get('#email').type('fabiana#gmail.com')
    cy.get('#open-text-area').type('teste')
    cy.contains('button', 'Enviar').click()

    cy.get('.error').should('be.visible')
    cy.tick(THREE_SECONDS_IN_MS)
    cy.get('.error').should('not.be.visible')

  })

  Cypress._.times(3, function () {
    it('Campo telefone continua vazio quando preenchido com valor não-númerico', function () {
      cy.get('#phone')
        .type('abcdefg')
        .should('have.value', '')
    })
  })

  it('Exibe mensagem de erro quando o telefone se torna obrigatório, mas não é preenchido', function () {

    cy.clock()

    cy.get('#firstName').type('Fabiana')
    cy.get('#lastName').type('Carvalho')
    cy.get('#email').type('fabiana@gmail.com')
    cy.get('#phone-checkbox').check()
    cy.get('#open-text-area').type('teste')
    cy.contains('button', 'Enviar').click()

    cy.get('.error').should('be.visible')
    cy.tick(THREE_SECONDS_IN_MS)
    cy.get('.error').should('not.be.visible')

  })

  it('Preenche e limpa os campos nome, sobrenome, email e telefone', function () {
    cy.get('#firstName')
      .type('Fabiana')
      .should('have.value', 'Fabiana')
      .clear()
      .should('have.value', '')
    cy.get('#lastName')
      .type('Carvalho')
      .should('have.value', 'Carvalho')
      .clear()
      .should('have.value', '')
    cy.get('#email')
      .type('fabiana@gmail.com')
      .should('have.value', 'fabiana@gmail.com')
      .clear()
      .should('have.value', '')
    cy.get('#phone')
      .type('1234567890')
      .should('have.value', '1234567890')
      .clear()
      .should('have.value', '')

  })

  it('Exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function () {
    cy.clock()
    cy.get('button[type="submit"]').click()
    cy.get('.error').should('be.visible')
    cy.tick(THREE_SECONDS_IN_MS)
    cy.get('.error').should('not.be.visible')

  })

  it('Envia o formulário com sucesso usando um comando customizado', function () {
    cy.clock()
    cy.fillMandatoryFieldsAndSubmit()

    cy.get('.success').should('be.visible')
    cy.tick(THREE_SECONDS_IN_MS)
    cy.get('.success').should('not.be.visible')
  })

  it('Seleciona um produto (YouTube) por seu texto', function () {
    cy.get('#product')
      .select('YouTube')
      .should('have.value', 'youtube')
  })

  it('Seleciona um produto (Mentoria) por seu valor (value)', function () {
    cy.get('#product')
      .select('mentoria')
      .should('have.value', 'mentoria')
  })

  it('Seleciona um produto (Blog) pelo indice (1)', function () {
    cy.get('#product')
      .select(1)
      .should('have.value', 'blog')
  })

  it('Marca o tipo de atendimento "Feedback"', function () {
    cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should('have.value', 'feedback')
  })

  it('Marca cada tipo de atendimento', function () {
    cy.get('input[type="radio"]')
      .should('have.length', 3)
      .each(function ($radio) {
        cy.wrap($radio).check()
        cy.wrap($radio).should('be.checked')
      })
  })

  it('Marca ambos checkboxes, depois desmarca o último', function () {
    cy.get('input[type="checkbox"]')
      .check()
      .should('be.checked')
      .last()
      .uncheck()
      .should('not.be.checked')
  })


  it('Marca ambos checkboxes, depois desmarca o primeiro', function () {
    cy.get('input[type="checkbox"]')
      .check()
      .should('be.checked')
      .first()
      .uncheck()
      .should('not.be.checked')

  })

  it('Seleciona um arquivo da pasta fixtures', function () {
    cy.get('input[type="file"]')
      .should('not.have.value')
      .selectFile('./cypress/fixtures/example.json')
      .should(function ($input) {
        //console.log($input) -- para localizar a posição correta o array
        expect($input[0].files[0].name).to.equal('example.json')
      })
  })


  it('Seleciona um arquivo simulando um drag-and-drop', function () {
    cy.get('input[type="file"]')
      .should('not.have.value')
      .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop' }) //drag-drop serve para arrastar o arquivo da pasta para o local desejado
      .should(function ($input) {
        expect($input[0].files[0].name).to.equal('example.json')
      })
  })

  it('Seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function () {
    cy.fixture('example.json').as('sampleFile')
    cy.get('input[type="file"]')
      .selectFile('@sampleFile')
      .should(function ($input) {
        expect($input[0].files[0].name).to.equal('example.json')

      })
  })

  it('Verifica que a politica de privacidade abre em outra aba sem a necessidade de um clique', function () {
    cy.get('#privacy a').should('have.attr', 'target', '_blank')

  })

  it('Acessa a página da politica de privacidade removendo o target e então clicando no link', function () {
    cy.get('#privacy a')
      .invoke('removeAttr', 'target')
      .click()

    cy.contains('Talking About Testing').should('be.visible')


  })

  it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', () => {
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide')
      .should('not.be.visible')
    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible')
  })

  it('Preenche a area de texto usando o comando invoke', function () {
    const longText = Cypress._.repeat('0123456789', 20)

    cy.get('#open-text-area')
      .invoke('val', longText)
      .should('have.value', longText)
  })

  it('Faz uma requisição HTTP', function () {
    cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
      .should(function (response) {
        //console.log(response) para rastrear
        const { status, statusText, body } = response
        expect(status).to.equal(200)
        expect(statusText).to.equal('OK')
        expect(body).to.include('CAC TAT')

      })
  })

  it('Encontrar o gato escondido', function () {
    cy.get('#cat')
      .invoke('show')
      .should('be.visible')
    cy.get('#title')
      .invoke('text', 'CAT TAT')
    cy.get('#subtitle')
      .invoke('text', 'Eu pego 🔥')
  })
})















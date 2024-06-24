describe('login page', () => {
    it('Devrait se connecter avec succès et afficher le bouton panier', () => {
      cy.visit('http://localhost:8080/#/login')
      cy.get('#username').type('test2@test.fr')
      cy.get('#password').type('testtest')
      cy.get('button[data-cy="login-submit"]').click()
      cy.contains('button', 'Voir les produits').should('be.visible');
    })
  })


 
   


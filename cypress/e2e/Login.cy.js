describe('login page', () => {
    const validUsername = Cypress.env('validUsername');
    const validPassword = Cypress.env('validPassword');
    const invalidUsername = Cypress.env('invalidUsername');
    const invalidPassword = Cypress.env('invalidPassword');

    it('Devrait se connecter avec succès et afficher le bouton panier', () => {
      cy.visit('http://localhost:8080/#/login')
      cy.get('#username').type(validUsername)
      cy.get('#password').type(validPassword)
      cy.get('button[data-cy="login-submit"]').click()
      cy.contains('button', 'Voir les produits').should('be.visible');
    })

    it('Ne devrait pas se connecter avec des identifiants invalides', () => {
      cy.visit('http://localhost:8080/#/login');
      cy.get('#username').type(invalidUsername);
      cy.get('#password').type(invalidPassword);
      cy.get('button[data-cy="login-submit"]').click();
      cy.contains('Identifiants incorrects').should('be.visible'); // Vérifiez le message d'erreur attendu
    });
    
    it('Ne devrait pas se connecter avec des champs vides', () => {
      cy.visit('http://localhost:8080/#/login');
      cy.get('button[data-cy="login-submit"]').click(); // Tentative de connexion sans remplir les champs
      cy.contains('Merci de remplir correctement tous les champs').should('be.visible'); // Vérifiez le message d'erreur attendu
  });
});
  


 
   


describe('Test de gestion des entrées très longues pour un avis', () => {
    const validUsername = Cypress.env('validUsername');
    const validPassword = Cypress.env('validPassword');
    
    it('Soumission d\'un avis avec un commentaire trop long', () => {
        // Authentification
        cy.login(validUsername, validPassword);
        cy.contains('button', 'Voir les produits').should('be.visible');

        cy.visit('http://localhost:8080/#/reviews');

        // Générer une chaîne de caractères très longue
        const longComment = 'X'.repeat(500); // 5 000 caractères pour simuler un abus

        // Remplir les champs du formulaire
        cy.get('[data-cy="review-input-title"]').type('Un avis très long'); // Titre
        cy.get('[data-cy="review-input-comment"]').type(longComment); // Commentaire

        // Soumettre le formulaire
        cy.get('[data-cy="review-submit"]').click();

        // Vérifier que le système gère correctement l'erreur
        cy.contains('Votre commentaire est trop long', { timeout: 10000 }).should('be.visible'); // Message d'erreur attendu
        cy.url().should('include', '/reviews'); // Vérification que l'utilisateur reste sur la page*/
    });

    it('Soumission d\'un avis avec une injection XSS', () => {
        // Authentification
        cy.login(validUsername, validPassword);
        cy.contains('button', 'Voir les produits').should('be.visible');
      
        cy.visit('http://localhost:8080/#/reviews');
      
        // Injection d'un script malveillant dans le commentaire
        const xssComment = '<script>alert("XSS")</script>'; // Exemple de script malveillant
      
        // Définir le stub pour intercepter les alertes
        cy.window().then((win) => {
        cy.stub(win, 'alert').as('alertStub'); // Définir et aliaser
    });
        // Remplir les champs du formulaire
        cy.get('[data-cy="review-input-title"]').type('Avis avec injection XSS'); // Titre
        cy.get('[data-cy="review-input-comment"]').type(xssComment); // Commentaire avec injection XSS
      
        // Soumettre le formulaire
        cy.get('[data-cy="review-submit"]').click();
      
        // Vérification : Le script malveillant n'a pas été exécuté
        cy.get('@alertStub').should('not.have.been.called'); // L'alerte ne doit pas avoir été déclenchée
        // Vérifier que le système gère correctement l'injection XSS (le script ne doit pas être exécuté)
        cy.contains('Avis soumis avec succès').should('be.visible'); // Message de confirmation ou un message d'erreur lié à l'injection XSS
        cy.url().should('include', '/reviews'); // Vérification que l'utilisateur reste sur la page
      
        // Vérifier que l'alerte n'a pas été exécutée (le script ne doit pas être rendu/exécuté)
        cy.window().then((win) => {
          cy.stub(win, 'alert').callsFake(() => {}); // On empêche l'alerte de s'afficher
        });
      });

});
  
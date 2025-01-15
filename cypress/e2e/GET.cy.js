describe('Tests d\'API pour le site e-commerce', () => {
    const baseUrl = 'http://localhost:8081';
    const validUsername = Cypress.env('validUsername');
    const validPassword = Cypress.env('validPassword');
    
    let authToken;
  
    // Fonction d'aide pour récupérer un token valide avant les tests
    const getAuthToken = () => {
      return cy.request({
        method: 'POST',
        url: `${baseUrl}/login`, // Remplacez par votre endpoint d'authentification
        body: {
          username: validUsername, // Remplacez par un utilisateur valide
          password: validPassword // Remplacez par le mot de passe correct
        }
      }).then((response) => {
        expect(response.status).to.eq(200); // Vérifie que l'authentification réussit
        return response.body.token; // Retourne le token reçu
      });
    };
  
    before(() => {
      // Obtenir un jeton valide avant l'exécution des tests
      getAuthToken().then((token) => {
        authToken = token; // Stocke le jeton pour les tests suivants
      });
    });
  
    context('GET /orders sans authentification', () => {
      it('Devrait retourner une erreur 403 si l\'utilisateur n\'est pas authentifié', () => {
        cy.request({
          method: 'GET',
          url: `${baseUrl}/orders`,
          failOnStatusCode: false // Permet de capturer les réponses même avec des statuts d'erreur
        }).then((response) => {
          // Vérification du statut HTTP
          expect(response.status).to.eq(403); // Non authentifié
          expect(response.body).to.have.property('code', 403); // Vérifie le code d'erreur dans la réponse
          expect(response.body).to.have.property('message'); // Vérifie qu'un message d'erreur est présent
        });
      });
    });
  
    context('GET /orders avec authentification', () => {
      it('Devrait retourner la liste des produits dans le panier', () => {
        cy.request({
          method: 'GET',
          url: `${baseUrl}/orders`,
          headers: {
            Authorization: `Bearer ${authToken}` // Jeton d'accès
          }
        }).then((response) => {
          // Vérification du statut HTTP
          expect(response.status).to.eq(200); // Succès
          expect(response.body.orderLines).to.be.an('array'); // La réponse doit être une liste (tableau)
          response.body.orderLines.forEach((orderLine) => {
            // Vérifications spécifiques pour chaque produit
            expect(orderLine).to.have.property('id');
            expect(orderLine).to.have.property('product');
            expect(orderLine.product).to.have.property('id');
            expect(orderLine.product).to.have.property('name');
          });
        });
      });
    });
  
    context('GET /products/{id}', () => {
      it('Devrait retourner la fiche d\'un produit spécifique', () => {
        const productId = 3; // Remplacez par un ID valide d’un produit
  
        cy.request({
          method: 'GET',
          url: `${baseUrl}/products/${productId}`
        }).then((response) => {
          // Vérification du statut HTTP
          expect(response.status).to.eq(200); // Succès
          // Vérifications sur le contenu du produit
          expect(response.body).to.have.property('id', productId); // Vérifie l'ID du produit
          expect(response.body).to.have.property('name'); // Vérifie que le produit a un nom
          expect(response.body).to.have.property('price'); // Vérifie que le produit a un prix
          expect(response.body).to.have.property('description'); // Vérifie la description
        });
      });
    });
  });
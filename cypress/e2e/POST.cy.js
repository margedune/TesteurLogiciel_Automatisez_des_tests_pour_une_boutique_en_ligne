const baseUrl = 'http://localhost:8081';
const validUsername = Cypress.env('validUsername');
const validPassword = Cypress.env('validPassword');
const invalidUsername = Cypress.env('invalidUsername');
const invalidPassword = Cypress.env('invalidPassword');

describe('API Tests - Login', () => {
    it('devrait retourner 401 pour un utilisateur inconnu', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/login`,
        body: {
          username: invalidUsername,
          password: invalidPassword
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(401);
      });
    });
  
    it('devrait retourner 200 pour un utilisateur connu', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/login`,
        body: {
          username: validUsername,
          password: validPassword
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        cy.setCookie('authToken', response.body.token); // Stocker le token pour les autres tests
      });
    });
  });

  describe('API Tests - Ajout produit disponible au panier', () => {
    let authToken;
  
    before(() => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/login`,
        body: {
          username: validUsername,
          password: validPassword
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        authToken = response.body.token;
      });
    });
  
    it('devrait ajouter un produit disponible au panier', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/orders/add`,
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        body: {
          product: { 
            id: 5 // L'ID du produit encapsulé dans un objet 
          }, // ID du produit disponible
          quantity: 1
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        
      });
    });
    
  });

  describe('API Tests - Ajout produit en rupture de stock au panier', () => {
    let authToken;
  
    before(() => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/login`,
        body: {
          username: validUsername,
          password: validPassword
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        authToken = response.body.token;
      });
    });
  
    it('devrait retourner une erreur lors de l\'ajout d\'un produit en rupture de stock au panier', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/orders/add`,
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        body: {
          productId: 2, // ID du produit en rupture de stock
          quantity: 1
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.not.equal(200);
        // Vérifiez le message d'erreur ou le code de statut si applicable
      });
    });
  });
  
  describe('API Tests - Ajout avis', () => {
    let authToken;
  
    before(() => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/login`,
        body: {
          username: validUsername,
          password: validPassword
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        authToken = response.body.token;
      });
    });
  
    it('devrait ajouter un avis', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/reviews`,
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        body: {
          title: "test review", 
          rating: 5,
          comment: 'Excellent produit!'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        
      });
    });
  });
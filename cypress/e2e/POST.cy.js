describe('API Tests - Login', () => {
    const baseUrl = 'http://localhost:8081';
  
    it('devrait retourner 401 pour un utilisateur inconnu', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/login`,
        body: {
          username: 'utilisateurInconnu',
          password: 'mauvaisMotDePasse'
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
          username: 'test2@test.fr',
          password: 'testtest'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        cy.setCookie('authToken', response.body.token); // Stocker le token pour les autres tests
      });
    });
  });

  describe('API Tests - Add Available Product to Cart', () => {
    const baseUrl = 'http://localhost:8081';
    let authToken;
  
    before(() => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/login`,
        body: {
          username: 'test2@test.fr',
          password: 'testtest'
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
          productId: 1, // ID du produit disponible
          quantity: 1
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        
      });
    });
    
  });

  describe('API Tests - Add Out of Stock Product to Cart', () => {
    const baseUrl = 'http://localhost:8081';
    let authToken;
  
    before(() => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/login`,
        body: {
          username: 'test2@test.fr',
          password: 'testtest'
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
  
  describe('API Tests - Add Review', () => {
    const baseUrl = 'http://localhost:8081';
    let authToken;
  
    before(() => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/login`,
        body: {
          username: 'test2@test.fr',
          password: 'testtest'
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
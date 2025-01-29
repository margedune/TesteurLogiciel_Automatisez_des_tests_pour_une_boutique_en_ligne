const baseUrl = 'http://localhost:8081';
const validUsername = Cypress.env('validUsername');
const validPassword = Cypress.env('validPassword');
const invalidUsername = Cypress.env('invalidUsername');
const invalidPassword = Cypress.env('invalidPassword');
let authToken;

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
      authToken = response.body.token;
    });
  });
});

describe('API Tests - Ajout produit disponible au panier', () => {
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
        },
        quantity: 1
      }
    }).then((response) => {
      expect(response.status).to.equal(200);
    });
  });
});

describe('API Tests - Ajout produit en rupture de stock au panier', () => {
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

describe('Tests d\'API pour le site e-commerce', () => {
  context('GET /orders sans authentification', () => {
    it('Devrait retourner une erreur 403 si l\'utilisateur n\'est pas authentifié', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/orders`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(403);
        expect(response.body).to.have.property('code', 403);
        expect(response.body).to.have.property('message');
      });
    });
  });

  context('GET /orders avec authentification', () => {
    it('Devrait retourner la liste des produits dans le panier', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/orders`,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.orderLines).to.be.an('array');
        response.body.orderLines.forEach((orderLine) => {
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
      const productId = 3;

      cy.request({
        method: 'GET',
        url: `${baseUrl}/products/${productId}`
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('id', productId);
        expect(response.body).to.have.property('name');
        expect(response.body).to.have.property('price');
        expect(response.body).to.have.property('description');
      });
    });
  });
});

describe('Test de gestion des entrées très longues pour un avis', () => {
  it('Soumission d\'un avis avec un commentaire trop long', () => {
    cy.login(validUsername, validPassword);
    cy.contains('button', 'Voir les produits').should('be.visible');

    cy.visit('http://localhost:8080/#/reviews');

    const longComment = 'X'.repeat(500); // Long commentaire pour simuler un abus

    cy.get('[data-cy="review-input-title"]').type('Un avis très long');
    cy.get('[data-cy="review-input-comment"]').type(longComment);

    cy.get('[data-cy="review-submit"]').click();

    cy.contains('Votre commentaire est trop long', { timeout: 10000 }).should('be.visible');
    cy.url().should('include', '/reviews');
  });

  it('Soumission d\'un avis avec une injection XSS', () => {
    cy.login(validUsername, validPassword);
    cy.contains('button', 'Voir les produits').should('be.visible');

    cy.visit('http://localhost:8080/#/reviews');

    const xssComment = '<script>alert("XSS")</script>';
 
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alertStub');
    });

    cy.get('[data-cy="review-input-title"]').type('Avis avec injection XSS');
    cy.get('[data-cy="review-input-comment"]').type(xssComment);

    cy.get('[data-cy="review-submit"]').click();

    cy.get('@alertStub').should('not.have.been.called');
    cy.contains('Avis soumis avec succès').should('be.visible');
    cy.url().should('include', '/reviews');
  });
});

const validUsername = Cypress.env('validUsername');
const validPassword = Cypress.env('validPassword');

describe('Login Fields Presence', () => {
    it('devrait afficher les champs et les boutons de connexion', () => {
        cy.visit('http://localhost:8080/#/login'); 
    
        // Vérifiez la présence des champs de connexion
        cy.get('#username').should('be.visible');
        cy.get('#password').should('be.visible');
    
        // Vérifiez la présence des boutons de connexion
        cy.get('button[data-cy="login-submit"]').should('be.visible');
        cy.get('a[href="#/register"]').should('be.visible');
    });
});

describe('Présence du champ de disponibilité du produit', () => {
    before(() => {
        cy.visit('http://localhost:8080/#/login')
        cy.get('#username').type(validUsername)
        cy.get('#password').type(validPassword)
        cy.get('button[data-cy="login-submit"]').click()
        cy.contains('button', 'Voir les produits').should('be.visible'); 
    });

    let productIds = [];
    it('devrait afficher le champ de disponibilité du produit', () => {
        cy.visit('http://localhost:8080/#/products'); 
  
        // Vérifiez la présence du champ de disponibilité du produit
        cy.get('button[data-cy="product-link"]').should('have.length', 8);

        cy.get('button[data-cy="product-link"]').each(($el) => {
            // Recuperer les ids de tous les produits
            cy.wrap($el).invoke('attr', 'ng-reflect-router-link').then((attr) => {
                let productId = parseInt(attr.split(",")[1]);
                productIds.push(productId);
            });
        });
    });

    it('Tous les produits ont un bouton Ajouter au panier', () => {
        productIds.forEach(productId => {
            cy.visit(`http://localhost:8080/#/products/${productId}`);
            cy.get('button[data-cy="detail-product-add"]').should('exist');
        });
    });
});

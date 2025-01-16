var actualCartAmount = 0;
describe('login page', () => {
    const validUsername = Cypress.env('validUsername');
    const validPassword = Cypress.env('validPassword');

    for (let Id_product = 3; Id_product <= 10; Id_product++) {
        it('Ajout de produit au panier avec vérifications', () => {
            // Authentification
            cy.login(validUsername, validPassword);
            cy.contains('button', 'Voir les produits').should('be.visible');

            cy.intercept('GET', `**/products/${Id_product}`).as('getProduct'); 

            // Visiter la page du produit
            // Recuperer le nom du produit
            cy.visit(`http://localhost:8080/#/products/${Id_product}`);
            cy.get('[data-cy="detail-product-name"]').invoke('text').as('productName');

            // Attendre que l'appel réseau soit terminé
            let stockInial = 0
            cy.wait('@getProduct').then((interception) => {
                cy.log('Requête AJAX terminée', interception);

                // Récupérer et vérifier le texte après l'appel AJAX
                cy.get('[data-cy="detail-product-stock"]').invoke('text').as('stockText');
                cy.get('@stockText').then((stockText) => {
                    cy.log(`Contenu brut du stock : "${stockText}"`);
                    const match = stockText.match(/-?\d+/); // Inclut les nombres négatifs

                    if (match) {
                        stockInial = parseInt(match[0], 10);
                        cy.log(`Stock numérique : ${stockInial}`);
                        expect(stockInial).to.be.greaterThan(1); // Testez le stock selon vos attentes
                    } else {
                        throw new Error('Aucun nombre trouvé dans le texte du stock');
                    }
                });
            });

            // Ajouter le produit au panier
            cy.get('button[data-cy="detail-product-add"]').click();
            
            // Verifier si le produit est ajouté dans le panier
            cy.visit('http://localhost:8080/#/cart');
            cy.get('@productName').then((productName) => {
                cy.get('#cart-content').should('contain', productName.trim()); // Vérifier la présence du produit dans le panier
            });

            cy.visit(`http://localhost:8080/#/products/${Id_product}`);
            cy.wait('@getProduct').then((interception) => {
                cy.log('Requête AJAX terminée', interception);

                // Récupérer et vérifier le texte après l'appel AJAX
                cy.get('[data-cy="detail-product-stock"]').invoke('text').as('stockText');
                cy.get('@stockText').then((stockText) => {
                    cy.log(`Contenu brut du stock : "${stockText}"`);
                    const match = stockText.match(/-?\d+/); // Inclut les nombres négatifs

                    if (match) {
                        const stock = parseInt(match[0], 10);
                        cy.log(`Stock numérique : ${stock}`);
                        expect(stock).to.eq(stockInial - 1); // Testez le stock selon vos attentes
                    } else {
                        throw new Error('Aucun nombre trouvé dans le texte du stock');
                    }
                });
            });
        });
    }
}); 

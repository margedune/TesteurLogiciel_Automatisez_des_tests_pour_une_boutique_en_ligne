var actualCartAmount = 0;
describe('login page', () => {
    const validUsername = Cypress.env('validUsername');
    const validPassword = Cypress.env('validPassword');

    for (let Id_product = 3; Id_product <= 10; Id_product++) { //parcourt les produits avec des ID allant de 3 à 10
        it('Ajout de produit au panier avec vérifications', () => {
            // Authentification
            cy.login(validUsername, validPassword);
            cy.contains('button', 'Voir les produits').should('be.visible');

            cy.intercept('GET', `**/products/${Id_product}`).as('getProduct'); //récupérer les détails d'un produit spécifique

            // Visiter la page du produit
            // Recuperer le nom du produit
            cy.visit(`http://localhost:8080/#/products/${Id_product}`);
            cy.get('[data-cy="detail-product-name"]').invoke('text').as('productName');//Le nom du produit est enregistré avec invoke

            // Attendre que l'appel réseau soit terminé
            let stockInial = 0
            cy.wait('@getProduct').then((interception) => {
                

                // Récupérer et vérifier le texte après l'appel AJAX
                cy.get('[data-cy="detail-product-stock"]').invoke('text').as('stockText'); //Récupère le texte de cet élément (le stock affiché en tant que texte brut)
                cy.get('@stockText').then((stockText) => {
                   
                    const match = stockText.match(/-?\d+/); // Inclut les nombres négatifs

                    if (match) {
                        stockInial = parseInt(match[0], 10); //Convertit le nombre trouvé (qui est une chaîne) en entier et le stocke dans stockInial
                      
                        expect(stockInial).to.be.greaterThan(1); // Vérifie que le stock numérique est supérieur à 1
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
               

                // Récupérer et vérifier le texte après l'appel AJAX
                cy.get('[data-cy="detail-product-stock"]').invoke('text').as('stockText');
                cy.get('@stockText').then((stockText) => {
                   
                    const match = stockText.match(/-?\d+/); // Inclut les nombres négatifs

                    if (match) {
                        const stock = parseInt(match[0], 10);
                       
                        expect(stock).to.eq(stockInial - 1); // Verifier que le stock initiale a été déduit
                    } else {
                        throw new Error('Aucun nombre trouvé dans le texte du stock');
                    }
                });
            });
        });
    }
}); 

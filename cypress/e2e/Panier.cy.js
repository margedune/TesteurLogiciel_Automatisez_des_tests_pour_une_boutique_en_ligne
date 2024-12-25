var Id_product = 3;
var actualCartAmount = 0;
describe('login page', () => {
    for (let Id_product = 3; Id_product <= 3; Id_product++) {
        
        it('Ajout de produit au panier avec vérifications', () => {
            // Authentification
            cy.visit('http://localhost:8080/#/login')
            cy.get('#username').type('test2@test.fr')
            cy.get('#password').type('testtest')
            cy.get('button[data-cy="login-submit"]').click()
            cy.contains('button', 'Voir les produits').should('be.visible');

            // Vider le panier
            /*cy.visit('http://localhost:8080/#/cart');
            cy.get('.cart-section').then((cartSection) => {
                cy.log(cartSection.find('#cart-content .product'));
            });*/

            // Visiter la page du produit
            // Recuperer le nom du produit
            cy.visit(`http://localhost:8080/#/products/${Id_product}`);
            cy.get('[data-cy="detail-product-name"]')
           
            .then((text) => {
                cy.log(text);
                cy.wrap(text).as('productName');
            });

            // Le stock doit être supérieur à 1 pour pouvoir être ajouté
            cy.get('p[data-cy="detail-product-stock"]').should(($stock) => {
                const stock = parseInt($stock.text(), 10);
                expect(stock).to.be.greaterThan(1);
            })

            // Ajouter le produit au panier
            cy.get('button[data-cy="detail-product-add"]').click();
            
            // Verifier si le produit est ajouté dans le panier
            cy.visit('http://localhost:8080/#/cart');
            cy.get('@productName').then((productName) => {
                cy.get('.cart-section').should('contain', productName);
            });
            cy.get('div[data-cy="cart-line"]').find('input[data-cy="cart-line-quantity"]').each(($el) => {
                cy.wrap($el).should('have.attr', 'min').and('be.gte', '1');
            });
        });
    }
}); 
    /*aller dans la page panier, je cherche les poubelles, je clique sur la poubelle
    revenir dans la page produit j'ajoute le produit
    revenir dans la page panier et vérifier que le produit est bien ajouté


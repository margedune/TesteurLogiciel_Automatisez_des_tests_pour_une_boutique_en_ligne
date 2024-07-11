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

            // Accéder à la page des produits
            cy.visit('http://localhost:8080/#/');
            cy.contains('button', 'Voir les produits').click()

            // Cliquez sur un des produits
            cy.visit(`http://localhost:8080/#/products/${Id_product}`);
            cy.get('h1[data-cy="detail-product-name"]').invoke('text').then((text) => {
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




















    /*it('Ajout de produit au panier avec vérifications', () => {
        // Ajout du produit
        cy.visit('http://localhost:8080/#/products/5');
        cy.get('button[data-cy="detail-product-add"]').click();
            
        // Vérifier que le produit a été ajouté au panieR
        cy.get('div[data-cy="cart-line"]').find('input[data-cy="cart-line-quantity"]').contains('1');
        //cy.get('input[data-cy="cart-line-quantity"]').should('have.length', 1);
        // Retourner à la page du produit
        cy.go('back');
    });*/
}); 


/*it('Vérifier que le stock a été mis à jour', () => {
    cy.visit('http://localhost:8080/#/products/5');
    cy.get('div[data-cy="product-cart"]').find('p[data-cy="detail-product-stock"]').should(($stock) => {
    //cy.get('p[data-cy="detail-product-stock"]').should(($stock) => {
        console.log($stock);
        const updatedStock = parseInt($stock.text(), 10);
        expect(updatedStock).to.be.equal($stock - 1);
    });


it('Vérification des limites', () => {

    // Entrer un chiffre négatif
    cy.get('input[data-cy="detail-product-quantity"]').clear().type('-1');
    cy.get('button[data-cy="detail-product-add"]').click();
    cy.get('.error-message').should('contain', 'Quantité invalide');

    // Entrer un chiffre supérieur à 20
    cy.get('input[data-cy="detail-product-quantity"]').clear().type('21');
    cy.get('button[data-cy="detail-product-add"]').click();
    cy.get('.error-message').should('contain', 'Quantité invalide');
});

});*/
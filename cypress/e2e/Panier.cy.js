describe('login page', () => {
    it('Ajout de produit au panier avec vérifications', () => {
        // Accéder à la page des produits
        cy.visit('http://localhost:8080/#/');
        cy.contains('button', 'Voir les produits').click()

        // Sélectionner un produit
        cy.get('button[data-cy="product-link"]').eq(3).click();

        // Vérifier que le stock est supérieur à 1
        cy.get('p[data-cy="detail-product-stock"]').should(($stock) => {
            const stock = parseInt($stock.text(), 10);
            expect(stock).to.be.greaterThan(1);
        })
   

    it('Ajout de produit au panier avec vérifications', () => {
        // Ajout du produit
        cy.visit('http://localhost:8080/#/products/5');
        cy.get('button[data-cy="detail-product-add"]').click();
            
        // Vérifier que le produit a été ajouté au panieR
        //cy.contains('h3', 'Poussière de lune').parent().find('input[data-cy="cart-line-quantity"]').should('have.length', 1);
        cy.get('div[data-cy="cart-line"]').find('input[data-cy="cart-line-quantity"]').contains('1');
        //cy.get('input[data-cy="cart-line-quantity"]').should('have.length', 1);
        // Retourner à la page du produit
        cy.go('back');
    });
}); 


it('Vérifier que le stock a été mis à jour', () => {
    cy.visit('http://localhost:8080/#/products/5');
    cy.get('div[data-cy="product-cart"]').find('p[data-cy="detail-product-stock"]').should(($stock) => {
    //cy.get('p[data-cy="detail-product-stock"]').should(($stock) => {
        console.log($stock);
        const updatedStock = parseInt($stock.text(), 10);
        expect(updatedStock).to.be.equal($stock - 1);
    });
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

});
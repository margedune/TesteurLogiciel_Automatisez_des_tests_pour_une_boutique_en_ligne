describe('Orders API Tests', () => {
    it('should return 403 when trying to access orders without authentication', () => {
        cy.request({
            method: 'GET',
            url: 'http://localhost:8081/orders',
            failOnStatusCode: false // Ne pas échouer le test sur un statut HTTP 4xx/5xx
        }).then((response) => {
            expect(response.status).to.eq(401);
        });
    });
});


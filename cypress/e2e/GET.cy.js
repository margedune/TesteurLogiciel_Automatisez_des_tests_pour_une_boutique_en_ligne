describe('Orders API Tests', () => {
	it('should return 403 when trying to access orders without authentication', () => {
		cy.request({
			method: 'GET',
			url: 'http://localhost:8081/orders',
			failOnStatusCode: false // Ne pas échouer le test sur un statut HTTP 4xx/5xx
		}).then((response) => {
			expect(response.status).to.eq(403);
		});
	});
});

describe('API Tests - Cart Products List', () => {
	const baseUrl = 'http://localhost:8081';
	let authToken;

	// Fonction d'aide pour la connexion
	const login = (username, password) => {
		return cy.request({
			method: 'POST',
			url: `${baseUrl}/login`,
			body: {
				username,
				password
			},
			failOnStatusCode: false
		});
	};

	before(() => {
		// Connexion avec un utilisateur connu pour obtenir le token d'authentification
		login('test2@test.fr', 'testtest')
			.then((response) => {
				expect(response.status).to.equal(200);
				authToken = response.body.token; // Supposons que le token est dans le corps de la réponse
			});
	});

	it('devrait retourner la liste des produits dans le panier', () => {
		cy.request({
			method: 'GET',
			url: `${baseUrl}/orders`,
			headers: {
				Authorization: `Bearer ${authToken}`
			}
		}).then((response) => {
			expect(response.status).to.equal(200);
			const orderLines = response.body.orderLines;
			expect(orderLines).to.be.an('array');
			expect(orderLines).to.have.length(1);
			// D'autres assertions peuvent être ajoutées en fonction de la structure de la réponse
		});
	});
});
/*
describe('API Tests - Specific Product Details', () => {
	const baseUrl = 'http://localhost:8081';
  
	it('devrait retourner la fiche produit pour un ID spécifique', () => {
	  const productId = 1; // Spécifiez l'ID du produit que vous voulez tester
  
	  cy.request({
		method: 'GET',
		url: `${baseUrl}/products/${productId}`
	  }).then((response) => {
		expect(response.status).to.equal(200);
		expect(response.body).to.have.property('id', productId);
		// D'autres assertions peuvent être ajoutées en fonction de la structure de la réponse
	  });
	});
  });
  */
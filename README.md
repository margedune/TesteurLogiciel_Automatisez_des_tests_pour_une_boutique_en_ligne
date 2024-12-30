# Installation du projet
1. Téléchargez ou clonez le dépôt
2. Depuis un terminal ouvert dans le dossier du projet, lancer la commande : `docker-compose up --build`
3. Ouvrez le site depuis la page http://localhost:8080 
configurations dans le fichier cypress.json
# Login
User name : test2@test.fr
password : “testtest”
# Fonctionnalités testées
1. Login
Connexion avec des identifiants valides.
Connexion avec des identifiants invalides.
Gestion des erreurs: message d'erreur.
2. Panier
Ajout d'un produit au panier.
Suppression d'un produit du panier.
Vérification des stocks.
3. API
Vérification des réponses des endpoints: GET, POST.
Validation des statuts HTTP et des données JSON.
# Projet e-Commerce API

## Description
Une API REST pour gérer un site e-commerce avec des fonctionnalités telles que la gestion des utilisateurs, des produits, et des commandes.

## Prérequis
- Node.js >= 16.0.0
- NPM >= 7.0.0
- MySQL >= 8.0

## Installation du projet
1. Clonez le dépôt :
   ```bash
   git clone https://github.com/OpenClassrooms-Student-Center/TesteurLogiciel_Automatisez_des_tests_pour_une_boutique_en_ligne.git
   ```
2. Accédez au répertoire :
   ```bash
   C:\projet_automatisation
   ```
3. Installez les dépendances :
   ```bash
   npm install
   ```
4. Installez cypress :
   ```bash
   npm install cypress --save-dev
   ```
5. Depuis un terminal ouvert dans le dossier du projet, lancer la commande :
   ```bash
   `docker-compose up --build`
   ```


## Utilisation
L'API est accessible via `http://localhost:8081`. Vous pouvez consulter les routes principales dans `http://localhost:8081/api/doc`.

## Tests
Pour exécuter les tests :
```bash
npx cypress open
```


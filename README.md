# Gestion de Stock - Application Mobile

## Contexte du Projet
Un magasin souhaite moderniser et simplifier la gestion de son stock en mettant à disposition des magasiniers une application intuitive.

Cette application permettra :
- Une gestion rapide des stocks grâce à un scanner de code-barres et une saisie manuelle.
- Un suivi en temps réel des produits avec la possibilité d'ajouter ou de retirer des quantités en stock.
- L’ajout simplifié de nouveaux produits via un formulaire interactif.

L’objectif est d’optimiser la gestion du stock tout en réduisant les erreurs humaines.

## Fonctionnalités Principales

### 1. Authentification
- Chaque utilisateur dispose d’un code secret personnel pour accéder à l'application.

### 2. Gestion des Produits
- **Identification des produits** :
  - Scanner de code-barres intégré (via `expo-barcode-scanner`).
  - Saisie manuelle en cas de dysfonctionnement du scanner.
  - Vérification automatique dans la base de données.
- **Produit existant** :
  - Ajout ou retrait de quantités en stock.
  - Affichage des informations du produit (nom, type, prix, quantité disponible par entrepôt).
- **Produit non existant** :
  - Formulaire de création avec :
    - Nom, type, prix, fournisseur, quantité initiale, image (facultatif).

### 3. Liste des Produits
- Affichage détaillé des produits stockés avec :
  - Nom, type, prix (ex: “Solde”, “Prix régulier”), quantité disponible.
  - État du stock :
    - Rouge : produit en rupture de stock.
    - Jaune : faible quantité (<10 unités).
- Actions disponibles :
  - Bouton "Réapprovisionner".
  - Bouton "Décharger".
- **Filtrage et Recherche** :
  - Recherche par nom, type, prix ou fournisseur.
- **Tri Dynamique** :
  - Par prix croissant/décroissant, nom alphabétique ou quantité.

### 5. Statistiques et Résumé des Stocks
- Tableau de bord avec :
  - Nombre total de produits.
  - Nombre total de villes.
  - Produits en rupture de stock.

### 6. Sauvegarde et Export des Données
- Exportation de rapports produits en PDF (`expo-print`).


## Technologies Utilisées
- **Frontend** : React Native, Expo
- **Backend** : JSON Server
- **Librairies** : expo-camera, expo-print, json-server

## Installation et Déploiement
1. **Cloner le projet** :
   ```sh
   git clone https://github.com/e-lglioui
   cd StockManager
   ```
2. **Installer les dépendances** :
   ```sh
   npm install
   ```
3. **Lancer l'application** :
   ```sh
   expo start
   ```
4. **Démarrer le serveur JSON** :
   ```sh
   npx json-server db.json
   ```

## Contributeurs
- Fatima Ezzahra elglioui


## Licence
Ce projet est sous licence MIT.


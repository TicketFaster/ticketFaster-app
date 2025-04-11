# Ticket Faster - Plateforme de Billetterie

Application Angular de billetterie en ligne pour la gestion d'événements et la vente de billets.

## Fonctionnalités

- Authentification des utilisateurs (inscription, connexion)
- Gestion des profils utilisateurs
- Gestion des événements
- Gestion des catégories d'événements
- Gestion des billets
- Tableau de bord analytique (Administrateur) : Fournit des informations sur les ventes de billets, les événements populaires, et d'autres statistiques clés.
- Interface d'administration

## Tableau de bord analytique

Le tableau de bord analytique, accessible aux administrateurs, offre une vue d'ensemble des performances de la plateforme. Il comprend les données suivantes :

- **Ventes totales :** Nombre total de billets vendus.
- **Revenus générés :** Montant total des revenus générés par les ventes de billets.
- **Événements les plus populaires :** Liste des événements avec le plus grand nombre de billets vendus.
- **Ventes par catégorie :** Répartition des ventes de billets par catégorie d'événement.
- **Tendances des ventes :** Graphique illustrant l'évolution des ventes de billets sur une période donnée.

## Stack de développement

Ce projet utilise les technologies suivantes :

- Angular 19
- Typescript
- SCSS
- Bootstrap 5
- Font Awesome
- API REST (backend séparé)

## Déploiement sur Vercel

L'application frontend est déployée sur Vercel, une plateforme de déploiement et d'hébergement cloud.

## API Backend

Le backend de l'application, qui gère la logique métier et la persistance des données, est une API RESTful distincte. Elle est actuellement déployée sur Render.

## Déploiement du Frontend sur Vercel

L'application est configurée pour être déployée facilement sur Vercel.

### Prérequis

- Un compte Vercel
- Node.js installé localement
- [CLI Vercel](https://vercel.com/cli) (optionnel)

### Étapes de déploiement

1. Clonez ce dépôt
2. Assurez-vous que le build fonctionne localement avec `npm run build`
3. Méthode 1 : Déploiement via l'interface web Vercel
   - Importez votre projet sur Vercel
   - Configurez le projet avec les paramètres suivants :  
     - Framework Preset: Angular
     - Build Command: `npm run vercel-build`
     - Output Directory: `dist/billetterie-frontend`
     - Installez les dépendances avec `npm install`

4. Méthode 2 : Déploiement via la CLI Vercel
   - Installez la CLI Vercel : `npm i -g vercel`
   - Connectez-vous à votre compte : `vercel login`
   - Déployez le projet : `vercel`

## Configuration d'environnement

Les fichiers d'environnement sont configurés pour pointer vers l'API déployée sur Render :
- API de production : https://ticketfaster-api.onrender.com/api

## Développement local

1. Clonez le dépôt  
2. Installez les dépendances : `npm install`
3. Démarrez le serveur de développement : `npm start`
4. Accédez à `http://localhost:4200/`

## Scripts disponibles

- `npm start` : Démarre le serveur de développement
- `npm run build` : Construit l'application
- `npm run vercel-build` : Construit l'application pour Vercel
- `npm test` : Exécute les tests unitaires
- `npm run watch` : Mode de développement avec reconstruction automatique

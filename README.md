# Ticket Faster - Plateforme de Billetterie

Application Angular de billetterie en ligne pour la gestion d'événements et la vente de billets.

## Fonctionnalités

- Authentification des utilisateurs (inscription, connexion)
- Gestion des profils utilisateurs
- Gestion des événements
- Gestion des catégories d'événements
- Gestion des billets
- Tableau de bord analytique
- Interface d'administration

## Technologies utilisées

- Angular 19
- TypeScript
- SCSS
- Bootstrap 5
- Font Awesome
- API REST (backend séparé)

## Déploiement sur Vercel

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

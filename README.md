# Cyna Store

Cyna Store est une application web moderne construite avec Next.js qui permet aux utilisateurs de gérer leurs informations personnelles et leurs préférences RGPD en toute sécurité.

## Fonctionnalités

- 🔐 **Authentification sécurisée** : Système complet d'authentification avec NextAuth
- 👤 **Gestion de profil** : Modification des informations personnelles
- 🛡️ **Conformité RGPD** : Gestion des consentements et exportation des données
- 🌓 **Mode sombre/clair** : Interface utilisateur adaptative
- 👑 **Panneau d'administration** : Gestion des utilisateurs et paramètres du site
- 📱 **Responsive** : Compatible avec tous les appareils

## Technologies

- **Frontend** : Next.js, React, TailwindCSS, DaisyUI
- **Backend** : API Routes Next.js, Prisma ORM
- **Base de données** : SQLite
- **Authentification** : NextAuth.js
- **Paiements** : Stripe (intégration)
- **Emails** : Nodemailer

## Installation

1. Clonez le dépôt
```bash
git clone <url-du-repo>
cd CynaStoreWeb
```

2. Installez les dépendances
```bash
npm install
# ou
yarn install
# ou
bun install
```

3. Configurez les variables d'environnement
```bash
cp .env.example .env
# Puis modifiez .env avec vos propres valeurs
```

4. Exécutez les migrations Prisma
```bash
npx prisma migrate dev
```

5. Lancez le serveur de développement
```bash
npm run dev
# ou
yarn dev
# ou
bun dev
```

6. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur

## Déploiement

L'application peut être déployée sur Vercel, Netlify ou toute autre plateforme compatible avec Next.js.

```bash
npm run build
npm run start
```

## Structure du projet

- `/app` - Pages et composants spécifiques aux routes
- `/components` - Composants React réutilisables
- `/prisma` - Schéma et migrations de la base de données
- `/public` - Fichiers statiques
- `/libs` - Utilitaires et configurations
- `/app/api` - API Routes Next.js

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à soumettre une pull request ou à ouvrir une issue.

## Licence

Ce projet est sous licence [LICENSE](LICENCE.txt)

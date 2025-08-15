# 🛒 Cyna Store - Plateforme E-commerce B2B/B2C

**Cyna Store** est une plateforme e-commerce moderne et complète développée avec Next.js 14, offrant une solution complète pour la vente d'articles et de services avec gestion des entreprises et conformité RGPD.

## 🚀 Fonctionnalités Principales

### 👥 Gestion des Utilisateurs
- **Authentification complète** avec NextAuth.js
- **Profils utilisateurs** personnalisables
- **Gestion des rôles** (Admin, Utilisateur)
- **Validation email** et changement d'adresse
- **Suppression de compte** avec export des données

### 🏢 Gestion des Entreprises
- **Création et gestion d'entreprises**
- **Système d'invitations** par email
- **Rôles hiérarchiques** (Propriétaire, Admin, Membre)
- **Achats groupés** pour entreprises
- **Historique des commandes** par entreprise

### 🛍️ E-commerce
- **Catalogue d'articles** avec catégories
- **Gestion des stocks** en temps réel
- **Paniers d'achat** persistants
- **Intégration Stripe** pour les paiements
- **Abonnements** et achats ponctuels
- **Spécifications techniques** détaillées

### 🛡️ Conformité RGPD
- **Gestion des consentements** (Marketing, Analytics, Tiers)
- **Historique des consentements** avec audit trail
- **Export des données personnelles**
- **Période de rétention** configurable
- **Suppression des données** à la demande

### 🎨 Interface Utilisateur
- **Design responsive** avec TailwindCSS et DaisyUI
- **Mode sombre/clair** automatique
- **Carrousel dynamique** pour la page d'accueil
- **Blocs de contenu** personnalisables
- **Charts et statistiques** avec Chart.js

### 🔧 Administration
- **Panneau d'administration** complet
- **Gestion des articles** et catégories
- **Gestion des utilisateurs** et entreprises
- **Demandes de contact** centralisées
- **Statistiques** et analytics

## 🛠️ Technologies Utilisées

### Frontend
- **Next.js 14** - Framework React avec App Router
- **React 18** - Bibliothèque UI
- **TailwindCSS** - Framework CSS utilitaire
- **DaisyUI** - Composants UI prêts à l'emploi
- **Lucide React** - Icônes modernes
- **Chart.js** - Graphiques et visualisations

### Backend
- **API Routes Next.js** - API REST
- **Prisma ORM** - Gestion de base de données
- **PostgreSQL** - Base de données relationnelle
- **NextAuth.js** - Authentification
- **Stripe** - Paiements en ligne
- **Resend** - Envoi d'emails

### Outils de Développement
- **ESLint** - Linting du code
- **PostCSS** - Traitement CSS
- **Sharp** - Optimisation d'images
- **Bundle Analyzer** - Analyse des bundles

## 📦 Installation et Configuration

### Prérequis
- Node.js 18+ ou Bun
- PostgreSQL
- Compte Stripe (pour les paiements)
- Compte Resend (pour les emails)

### 1. Cloner le projet
```bash
git clone <url-du-repo>
cd CynaStoreWeb
```

### 2. Installer les dépendances
```bash
# Avec npm
npm install

# Avec yarn
yarn install

# Avec bun (recommandé)
bun install
```

### 3. Configuration des variables d'environnement
Créez un fichier `.env` à la racine du projet :

```env
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/cynastore"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-ici"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (Resend)
RESEND_API_KEY="re_..."

# Vercel Blob (stockage d'images)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# Crisp (support client)
NEXT_PUBLIC_CRISP_WEBSITE_ID="votre-crisp-id"
```

### 4. Configuration de la base de données
```bash
# Générer le client Prisma
npx prisma generate

# Exécuter les migrations
npx prisma migrate dev

# (Optionnel) Seeder la base de données
npx prisma db seed
```

### 5. Lancer le serveur de développement
```bash
# Avec npm
npm run dev

# Avec yarn
yarn dev

# Avec bun
bun dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🏗️ Structure du Projet

```
CynaStoreWeb/
├── app/                    # Pages et API routes (App Router)
│   ├── api/               # API endpoints
│   │   ├── admin/         # Routes d'administration
│   │   ├── auth/          # Authentification
│   │   ├── cart/          # Gestion du panier
│   │   ├── companies/     # Gestion des entreprises
│   │   └── stripe/        # Intégration Stripe
│   ├── dashboard/         # Interface utilisateur
│   │   ├── admin/         # Panneau d'administration
│   │   └── companies/     # Gestion des entreprises
│   └── (pages)/           # Pages publiques
├── components/            # Composants React réutilisables
├── libs/                  # Utilitaires et configurations
├── prisma/               # Schéma et migrations DB
├── public/               # Fichiers statiques
└── scripts/              # Scripts utilitaires
```

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel --prod
```

### Autres plateformes
```bash
# Build de production
npm run build

# Démarrer le serveur
npm run start
```

## 📊 Scripts Disponibles

```bash
# Développement
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Linting du code

# Optimisation
npm run optimize     # Optimisation des assets
npm run analyze      # Analyse du bundle
npm run css-analyze  # Analyse CSS

# Base de données
npx prisma generate  # Générer le client Prisma
npx prisma migrate   # Exécuter les migrations
npx prisma studio    # Interface de gestion DB
```

## 🔐 Sécurité

- **Authentification sécurisée** avec NextAuth.js
- **Validation des données** côté serveur
- **Protection CSRF** intégrée
- **Gestion sécurisée des sessions**
- **Chiffrement des mots de passe** avec bcrypt
- **Conformité RGPD** complète

## 📱 Fonctionnalités Avancées

### Gestion des Images
- **Upload optimisé** avec Vercel Blob
- **Redimensionnement automatique** avec Sharp
- **Formats supportés** : JPG, PNG, WebP

### Analytics et Monitoring
- **Statistiques de vente** par catégorie
- **Suivi des conversions**
- **Monitoring des performances**

### Support Client
- **Intégration Crisp** pour le chat
- **Système de tickets** via contact
- **FAQ dynamique**

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.


**Développé avec ❤️ par l'équipe Cyna Store**

# Trevn

Projet Next.js avec Supabase pour la base de données, GitHub pour le versioning et Vercel pour le déploiement.

---

## Table des matières

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Initialiser la base de données](#base-de-données)
- [Lancer le projet](#lancer-le-projet)
- [Lancer les scripts](#lancer-les-scripts)
- [Environnements](#environnements)
- [Bonnes pratiques](#bonnes-pratiques)
- [Ressources utiles](#ressources-utiles)

---

## Prérequis

- Node.js >= 18
- npm ou yarn
- Supabase CLI : [https://supabase.com/docs/guides/cli](https://supabase.com/docs/guides/cli)
- Docker (pour Supabase local)
- Git


---

## Installation

Clone le projet :

```bash
git clone <REPO_URL>
cd trevn
```

Installe les dépendances :
```bash
npm install
# ou
yarn install
```


---

## Base de données

### Supabase local
```bash
supabase start
supabase db push --local --include-seed
supabase migration up
```

### Supabase remote (préprod / prod)
```bash
supabase link --project-ref <PROJECT_REF>
supabase db push --include-seed
```

### Reset la BDD (uniquement si nécessaire)
```bash
supabase db reset
```


---

## Lancer le projet
```bash
npm run dev
# ou
yarn dev
```

Ouvre http://localhost:3000

---

## Lancer les scripts
Si vous avez copié la BDD ce n'est pas nécessaire de copier les scripts.
```bash
node scripts/nom_du_script.mjs
```


---

# Informations supplémentaires


---

## Environnements

### Fichiers .env
Le projet utilise trois environnements :

| Environnement | URL | Base Supabase | Fichier .env |
|---------------|-----|---------------|--------------|
| Local         | http://localhost:3000 | Supabase local | .env.local |
| Préprod       | https://preprod.trevn.app | Supabase preprod | .env.preprod |
| Production    | https://trevn.app | Supabase prod | .env.production |

Exemple de fichier `.env` :
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=<URL_SUPABASE>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ANON_KEY>
SUPABASE_SERVICE_ROLE_KEY=<SERVICE_ROLE_KEY>

# Next.js
NEXT_PUBLIC_APP_ENV=<local|preprod|production>

# Others
...
```

### Déploiement
1. Crée deux projets/domaines :
    - trevn.app → Production
    - preprod.trevn.app → Préprod

2. Variables d’environnement dans Vercel :

| Variable | Production | Préprod |
|----------|------------|---------|
| NEXT_PUBLIC_SUPABASE_URL | URL prod | URL preprod |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | ANON_KEY prod | ANON_KEY preprod |
| SUPABASE_SERVICE_ROLE_KEY | SERVICE_ROLE prod | SERVICE_ROLE preprod |

3. Push Git : Vercel déploie automatiquement le frontend.


### Diagramme des environnements
```text
           ┌─────────────┐
           │  Next.js    │
           │  Frontend   │
           └──────┬──────┘
                  │
        ┌─────────┴──────────┐
        │                    │
   ┌────▼─────┐        ┌─────▼─────┐
   │ Local DB │        │ Preprod DB│
   │ (Docker) │        │ Supabase  │
   └──────────┘        └───────────┘
        │                    │
        └─────► Prod DB ◄────┘
              (Supabase)
```


---

## Bonnes pratiques
- Séparer les environnements
- Ne jamais connecter préprod à la prod
- Versionner migrations et seeds
- Tester en local avant preprod/prod
- RLS et triggers gérés par init.sql
- Ne jamais mettre les clés secrets dans Git

---

## Ressources utiles
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)


---

#### [Retourner au début](#Trevn)
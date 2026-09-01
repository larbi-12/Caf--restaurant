# Maison Noor

Site web premium pour un restaurant marocain, avec un dashboard admin pour gérer le contenu sans modifier le code.

### Stack

React · Vite · Tailwind CSS · GSAP · Supabase

### Installation

```bash
npm install
npm run dev
```

### Admin

`/admin`

Authentification (email + mot de passe) et gestion du contenu avec Supabase.

Créez le compte admin dans Supabase Dashboard → Authentication → Users → Add user,
puis ajoutez son email dans la table `admin_users` (voir `supabase/seed.sql`).

### Supabase

```text
supabase/schema.sql
supabase/seed.sql
```

Base de données, réservations et images.

### Build

```bash
npm run build
```

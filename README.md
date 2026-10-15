# PYJOBS — Plateforme de recrutement

Projet Job Board développé dans le cadre du cursus Epitech (T-WEB-501).

PYJOBS permet aux candidats de rechercher des offres d'emploi et aux recruteurs de publier leurs annonces et de gérer les candidatures.

## Technologies

- Frontend : React 19, React Router 7, Vite 8, JavaScript, CSS
- Backend : Python, Django 6.1, Django REST Framework
- Base de données locale : SQLite
- API : communication entre React et Django via /api

## Fonctionnalités

### Espace candidat

- Inscription et connexion
- Consultation et recherche des offres d'emploi
- Consultation du détail d'une annonce
- Candidature et prévention des candidatures en double
- Suivi du statut des candidatures
- Gestion du profil

### Espace recruteur

- Création et modification des entreprises
- Publication et gestion des offres
- Consultation des candidatures reçues
- Mise à jour du statut des candidatures
- Tableau de bord et statistiques

### Espace administrateur

- Tableau de bord et statistiques
- Gestion des candidats et des employeurs
- Gestion des annonces et des entreprises
- Gestion des candidatures

## Organisation

- frontend/ : application React et configuration Vite
- pyjobswebsite/ : application Django et API REST
- pyjobswebsite/api/ : modèles, routes et vues API
- pyjobswebsite/requirements.txt : dépendances Python

## Installation

Prérequis : Git, Node.js compatible avec Vite 8 et Python compatible avec Django 6.1.

### Backend

Depuis la racine du projet :

```bash
cd pyjobswebsite
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Pour utiliser la base de données de démonstration :

```bash
cp db.demo.sqlite3 db.local.sqlite3
python manage.py migrate
python manage.py runserver
```

**Attention :** la commande `cp` remplace une éventuelle base locale existante. Sur une nouvelle installation, elle permet de récupérer directement les données de démonstration.

Django est accessible sur http://127.0.0.1:8000/.

### Comptes de démonstration

| Rôle | Identifiant | Mot de passe |
|---|---|---|
| Administrateur | `admin_demo` | `DemoPYJOBS2026!` |
| Candidat | `candidat_demo` | `DemoPYJOBS2026!` |
| Recruteur | `recruteur_demo` | `DemoPYJOBS2026!` |

Ces comptes sont fictifs et destinés uniquement à la démonstration du projet.

### Base de données

PYJOBS utilise SQLite pour son fonctionnement local.

Le fichier `script.sql` correspond au schéma SQL Server conçu initialement pour le projet. Il est conservé comme référence de conception, mais n'est pas utilisé par la configuration Django actuelle.

La structure de la base SQLite est gérée par les modèles et les migrations Django.

### Frontend

Dans un second terminal :

1. Se placer dans frontend/
2. Installer les dépendances avec npm ci
3. Démarrer le serveur avec npm run dev

React est accessible sur http://localhost:5173.

Vite transmet les requêtes /api au serveur Django sur le port 8000.

## Vérification

Pour compiler le frontend : npm run build, depuis frontend/.

## Sécurité et fichiers locaux

- Ne pas publier les fichiers .env ni les identifiants.
- Ne pas publier les bases SQLite locales contenant des données de test.
- Ne pas versionner les environnements virtuels, node_modules ou dist.

## Projet académique

Epitech — T-WEB-501 — Job Board 3

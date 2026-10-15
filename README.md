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

1. Se placer dans pyjobswebsite/
2. Créer un environnement virtuel avec python -m venv .venv
3. L'activer avec source .venv/bin/activate (Linux/WSL)
4. Installer les dépendances avec python -m pip install -r requirements.txt
5. Initialiser la base avec python manage.py migrate
6. Démarrer Django avec python manage.py runserver

Django est accessible sur http://127.0.0.1:8000.

Certaines dépendances Microsoft SQL Server et Azure peuvent nécessiter une configuration supplémentaire.

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

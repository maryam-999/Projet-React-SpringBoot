# 🎓 Application d'Évaluation et de Suivi des Stages

Ce projet est une application complète de gestion de stages, développée avec **React JS (Vite)** pour le frontend et **Spring Boot** pour le backend, sécurisée avec **Spring Security**. Il permet de gérer les stagiaires, leurs évaluations, les tuteurs, et bien plus.

---

## 📁 Structure du projet
├ Projet_StageEvalution/
├ Projet-ReactFront/
│_└── my-app/ ← Application frontend React JS + Vite

---

## ⚙️ Fonctionnalités principales

- 🔐 **Authentification sécurisée** via Spring Security
- 👥 Gestion des **stagiaires** et **tuteurs de stage**
- 📝 **Évaluation des stagiaires** par les tuteurs
- 📄 **Téléchargement de la fiche d’évaluation**
  - Le **tuteur** peut télécharger la fiche une fois l’évaluation terminée
  - Le **stagiaire** peut la télécharger **uniquement** si son stage a été évalué et validé
- 📅 **Calendrier personnalisé** pour chaque utilisateur (stagiaire, tuteur, administrateur)
  - Gestion des événements et des dates clés liés au stage
- 📊 **Dashboard personnalisé** selon le rôle de l’utilisateur
  - Affiche des **statistiques dynamiques** via la librairie **Nivo**
  - Vue synthétique avant d’accéder aux données détaillées

---

## 🧰 Technologies utilisées

### 🔹 Frontend (React JS + Vite)
- React
- Vite
- Axios
- React Router
- **[Nivo](https://nivo.rocks/)** pour les graphiques et statistiques

### 🔸 Backend (Spring Boot)
- Spring Boot
- Spring Security
- Spring Data JPA
- **MySQL** (base de données relationnelle)

---

## ▶️ Lancer le projet en local

### Backend
1. Aller dans le dossier `Projet_StageEvalution/`
2. Configurer le fichier `application.properties` avec ta base de données MySQL
3. Lancer le backend : ./mvnw spring-boot:run

### Frontend
1. Aller dans le dossier Projet-ReactFront/my-app/
2. Installer les dépendances : npm install
3. npm run dev

---
Projet dans le cadre d’un projet académique.











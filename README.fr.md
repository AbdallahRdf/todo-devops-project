# Todo List Microservices App - Projet de Surveillance DevOps

🚧 Une application backend de liste de tâches (Todo List) basée sur une architecture à microservices, construite avec Node.js, Express, TypeScript et MongoDB, conçue pour démontrer le déploiement et la surveillance avec Kubernetes et Datadog.

---

## 📚 Table des Matières

* [📦 Structure du Projet](#-structure-du-projet)
* [🔧 Vue d'ensemble des Services](#-vue-densemble-des-services)

  * [🛡️ Passerelle API](#️-passerelle-api)
  * [👤 Service Utilisateurs](#-service-utilisateurs)
  * [📋 Service Tâches](#-service-tâches)
* [⚙️ Variables d'Environnement](#️-variables-denvironnement)
* [🧪 Exécution en Local (Mode Dev)](#-exécution-en-local-mode-dev)
* [🐳 Exécution avec Docker Compose](#-exécution-avec-docker-compose)
* [☸️ Déploiement sur Kubernetes (Minikube)](#️-déploiement-sur-kubernetes-minikube)
* [📊 Surveillance avec Datadog](#-surveillance-avec-datadog)
* [🛠️ Commandes Utiles](#️-commandes-utiles)
* [🧰 Stack Technique](#-stack-technique)
* [📌 Notes](#-notes)
* [📜 Licence](#-licence)
* [📫 Contact](#-contact)

---

## 📦 Structure du Projet

```
.
├── api-gateway/
├── k8s/
│   ├── api-gateway/
│   ├── datadog/
│   ├── mongodb/
│   ├── tasks-service/
│   ├── users-service/
│   ├── global-configmap.yaml
│   ├── global-secrets.yaml (non inclus)
│   └── namespace.yaml
├── tasks-service/
├── users-service/
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

## 🔧 Vue d'ensemble des Services

### 🛡️ Passerelle API

* Transfère les requêtes HTTP vers les services utilisateurs et tâches.
* Valide et vérifie les JWT dans les routes protégées.

### 👤 Service Utilisateurs

* Gère l'inscription et la connexion des utilisateurs.
* Gère les opérations CRUD des utilisateurs.
* Authentifie à l'aide de JWT.

### 📋 Service Tâches

* Gère les opérations CRUD des tâches.
* Nécessite un JWT valide pour l'accès.

Tous les services utilisent :

* Node.js + Express
* TypeScript
* MongoDB pour la persistance

---

## ⚙️ Variables d'Environnement

Chaque service dispose de deux fichiers d'environnement :

* `.env` → Développement local
* `.env.docker` → Utilisé avec docker-compose

### Modèle de `.env` pour :

* Passerelle API :

```env
PORT=3000
JWT_SECRET=votre_secret_ici
USERS_SERVICE_URL=http://localhost:3001
TASKS_SERVICE_URL=http://localhost:3002
```

* Service utilisateurs :

```env
PORT=3001
MONGODB_CONNECTION_STRING=votre_chaine_mongodb
JWT_SECRET=votre_secret_ici
```

* Service tâches :

```env
PORT=3002
MONGODB_CONNECTION_STRING=votre_chaine_mongodb
JWT_SECRET=votre_secret_ici
```

Le fichier `.env.docker` est similaire au `.env`, à la différence près qu'il faut remplacer **localhost** par le nom du service correspondant (défini dans `docker-compose.yml`).

* Pour **MONGODB\_CONNECTION\_STRING** dans `.env` des services utilisateurs et tâches, remplacez **localhost** par **mongodb**.
* Pour **USERS\_SERVICE\_URL** et **TASKS\_SERVICE\_URL** dans `.env` de la passerelle API, utilisez **users-service** et **tasks-service** respectivement.

---

## 🧪 Exécution en Local (Mode Dev)

### Prérequis :

* Node.js + npm
* Une instance MongoDB locale en fonctionnement

### Étapes :

```bash
# Installer les dépendances pour chaque service
cd users-service && npm install
cd tasks-service && npm install
cd api-gateway && npm install

# Démarrer les services
npm run dev  # dans chaque dossier séparément
```

---

## 🐳 Exécution avec Docker Compose

### Prérequis :

* Docker
* Docker Compose

### Commande :

```bash
docker-compose up --build
```

Cela démarre :

* MongoDB
* Service Utilisateurs
* Service Tâches
* Passerelle API

Tous les services sont connectés via le bridge réseau Docker `todo-app-network`.

---

## ☸️ Déploiement sur Kubernetes (Minikube)

### Prérequis :

* [Minikube](https://minikube.sigs.k8s.io/docs/start/)
* [kubectl](https://kubernetes.io/docs/tasks/tools/)

### Création du fichier de secrets :

Modèle de fichier `global-secrets.yaml` :

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: todo-app
type: Opaque
data:
  JWT_SECRET: votre_jwt_secret_en_base64
```

### Étapes de déploiement :

```bash
# Démarrer Minikube
minikube start

# Créer le namespace\ nkubectl apply -f k8s/namespace.yaml

# Appliquer la config globale et les secrets
kubectl apply -f k8s/global-configmap.yaml
kubectl apply -f k8s/global-secrets.yaml  # Vous devez fournir ce fichier

# Déployer MongoDB
kubectl apply -f k8s/mongodb/

# Déployer users-service, tasks-service et api-gateway
kubectl apply -f k8s/users-service/
kubectl apply -f k8s/tasks-service/
kubectl apply -f k8s/api-gateway/
```

---

## 📊 Surveillance avec Datadog

Nous utilisons Datadog pour surveiller le cluster Kubernetes, les conteneurs et les logs.

### Prérequis :

* [Helm](https://helm.sh/docs/intro/install/)
* Un compte Datadog et une clé API

### Étape 1 : Installer Helm et l'opérateur Datadog

```bash
helm repo add datadog https://helm.datadoghq.com
helm repo update
helm install datadog-operator datadog/datadog-operator 
```

### Étape 2 : Déployer l'agent Datadog

```bash
# Appliquer la config de logs Node.js
kubectl apply -f k8s/datadog/nodejs-log-configmap.yaml

# Appliquer le manifeste de l'agent Datadog
kubectl apply -f k8s/datadog/datadog-agent.yaml
```

* L'agent Datadog est installé dans le namespace `default`.
* Fonctions activées : Logs, APM (traces), Conteneurs en direct, Collecteur OTEL.

---

## 🛠️ Commandes Utiles

### Voir les pods actifs :

```bash
kubectl get pods -n todo-app
```

### Voir les logs d’un pod :

```bash
kubectl logs <nom-du-pod> -n todo-app
```

---

## 🧰 Stack Technique

* Node.js + Express + TypeScript
* MongoDB
* Docker + Docker Compose
* Kubernetes (Minikube)
* Datadog (Logs + Metrics)

---

## 📌 Notes

* Les fichiers sensibles comme `.env` ne sont pas suivis par le contrôle de version.
* Minikube doit être actif avant d'appliquer les manifests.
* Les services sont déployés sous le namespace `todo-app`.

---

## 📜 Licence

Ce projet est à but éducatif et n’a pas de licence.

---

## 📫 Contact

N'hésitez pas à ouvrir une issue GitHub pour toute question ou retour.

# Todo List Microservices App - DevOps Monitoring Project


🚧 A backend microservices-based Todo List application built using Node.js, Express, TypeScript, and MongoDB, designed to demonstrate deployment and monitoring with Kubernetes and Datadog.

- 🇫🇷 [Read this document in French](README.fr.md)

---

## 📚 Table of Contents

- [📦 Project Structure](#-project-structure)  
- [🔧 Services Overview](#-services-overview)  
  - [🛡️ API Gateway](#️-api-gateway)  
  - [👤 Users Service](#-users-service)  
  - [📋 Tasks Service](#-tasks-service)  
- [⚙️ Environment Variables](#️-environment-variables)  
- [🧪 Running Locally (Dev Mode)](#-running-locally-dev-mode)  
- [🐳 Running with Docker Compose](#-running-with-docker-compose)  
- [☸️ Deploying to Kubernetes (Minikube)](#️-deploying-to-kubernetes-minikube)  
- [📊 Datadog Monitoring](#-datadog-monitoring)  
- [🛠️ Useful Commands](#️-useful-commands)  
- [🧰 Tech Stack](#-tech-stack)  
- [📌 Notes](#-notes)  
- [📜 License](#-license)  
- [📫 Contact](#-contact)

---

## 📦 Project Structure

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
│   ├── global-secrets.yaml (not included)
│   └── namespace.yaml
├── tasks-service/
├── users-service/
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

## 🔧 Services Overview

### 🛡️ API Gateway

* Forwards HTTP requests to users and tasks services.
* Validates and verifies JWTs in protected routes.

### 👤 Users Service

* Handles user registration and login.
* Handles CRUD operations for users.
* Authenticates using JWT.

### 📋 Tasks Service

* Handles CRUD operations for tasks.
* Requires a valid JWT for access.

All services use:

* Node.js + Express
* TypeScript
* MongoDB for persistence

---

## ⚙️ Environment Variables

Each service has two environment files:

* `.env` → Local development
* `.env.docker` → Needed for docker-compose

### `.env` template for:

- API gateway:

```env
PORT=3000
JWT_SECRET=your_secret_here
USERS_SERVICE_URL=http://localhost:3001
TASKS_SERVICE_URL=http://localhost:3002
```

- Users service:

```env
PORT=3001
MONGODB_CONNECTION_STRING=your_mongodb_connection_string
JWT_SECRET=your_secret_here
```

- Tasks service:

```env
PORT=3002
MONGODB_CONNECTION_STRING=your_mongodb_connection_string
JWT_SECRET=your_secret_here
```

`.env.docker` file for each service is similar to `.env`, the only difference is that instead of using localhost, you should use the name of the corresponding service as defined in `docker-compose.yml` (e.g., mongodb, users-service)

- For **MONGODB_CONNECTION_STRING** in the `.env` file for users service and tasks service, you have to replace **localhost** with **mongodb**.
- For **USERS_SERVICE_URL** and **TASKS_SERVICE_URL** in `.env` file for API gateway, replace **localhost** with **users-service** and **tasks-service** respectively.

---

## 🧪 Running Locally (Dev Mode)

### Requirements:

* Node.js + npm
* Local MongoDB instance running

### Steps:

```bash
# Install dependencies for each service
cd users-service && npm install
cd tasks-service && npm install
cd api-gateway && npm install

# Start services
npm run dev  # in each folder separately
```

---

## 🐳 Running with Docker Compose

### Requirements:

* Docker
* Docker Compose

### Command:

```bash
docker-compose up --build
```

This will start:

* MongoDB
* Users Service
* Tasks Service
* API Gateway

All services are networked using Docker bridge `todo-app-network`.

---

## ☸️ Deploying to Kubernetes (Minikube)

### Requirements:

* [Minikube](https://minikube.sigs.k8s.io/docs/start/)
* [kubectl](https://kubernetes.io/docs/tasks/tools/)

### Creating secret file:

Template for `global-sercrets.yaml` file:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: todo-app
type: Opaque
data:
  JWT_SECRET: your_jwt_secret_in_base64

```


### Deployment Steps:

```bash
# Start Minikube
minikube start

# Create namespace
kubectl apply -f k8s/namespace.yaml

# Apply global config & secrets
kubectl apply -f k8s/global-configmap.yaml
kubectl apply -f k8s/global-secrets.yaml  # You must provide this file

# Deploy MongoDB
kubectl apply -f k8s/mongodb/

# Deploy users-service, tasks-service, and api-gateway
kubectl apply -f k8s/users-service/
kubectl apply -f k8s/tasks-service/
kubectl apply -f k8s/api-gateway/
```

---

## 📊 Datadog Monitoring

We use Datadog to monitor the Kubernetes cluster, containers, and logs.

### Requirements:

* [Helm](https://helm.sh/docs/intro/install/)
* Create a datadog account and get your API key.

### Step 1: Install Helm & Datadog Operator

```bash
helm repo add datadog https://helm.datadoghq.com
helm repo update
helm install datadog-operator datadog/datadog-operator 
```

### Step 2: Deploy Datadog Agent

```bash
# Apply Node.js logging config
kubectl apply -f k8s/datadog/nodejs-log-configmap.yaml

# Apply the Datadog agent manifest
kubectl apply -f k8s/datadog/datadog-agent.yaml
```

* The Datadog Agent is installed in the `default` namespace.
* Features enabled: Logs, APM (traces), Live Containers, and OTEL Collector.

---

## 🛠️ Useful Commands

### View running pods:

```bash
kubectl get pods -n todo-app
```

### View logs of a pod:

```bash
kubectl logs <pod-name> -n todo-app
```

---

## 🧰 Tech Stack

* Node.js + Express + TypeScript
* MongoDB
* Docker + Docker Compose
* Kubernetes (Minikube)
* Datadog (Logs + Metrics)

---

## 📌 Notes

* Secrets like `.env` and sensitive keys are not tracked in version control.
* Minikube must be running before applying manifests.
* Services are deployed under the `todo-app` namespace.

---

## 📜 License

This project is for educational purposes and has no license.

---

## 📫 Contact

Feel free to open an issue on GitHub for questions or feedback.


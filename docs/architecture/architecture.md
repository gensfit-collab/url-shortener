# URL Shortener — System Architecture

## 1. Overview

The URL Shortener is a containerized web application that converts long URLs into short, shareable links.

The application is designed using a layered architecture with a lightweight frontend, a Node.js and Express backend API, and a PostgreSQL database.

The system will be developed locally using Docker Compose and deployed to AWS EC2 using Docker containers and Nginx as a reverse proxy.

The project also implements automated CI/CD using GitHub Actions and GitHub Container Registry (GHCR).

---

## 2. Architecture Goals

The architecture is designed to provide:

* A simple and responsive user interface
* Reliable URL shortening and redirection
* Persistent PostgreSQL storage
* Clear separation between frontend, backend, and database responsibilities
* Reproducible local development using Docker
* Automated testing and validation through CI
* Container image publishing through GHCR
* Cloud deployment on AWS EC2
* Secure handling of application configuration and secrets
* Health monitoring and operational visibility
* A maintainable structure suitable for future expansion

---

## 3. High-Level Architecture

```text
                         INTERNET
                            |
                            v
                    +---------------+
                    |    NGINX      |
                    | Reverse Proxy |
                    +-------+-------+
                            |
                            v
                    +---------------+
                    | Node.js /     |
                    | Express API   |
                    +-------+-------+
                            |
                            v
                    +---------------+
                    |  PostgreSQL   |
                    |   Database    |
                    +---------------+

        User Browser
             |
             v
      Frontend Application
       HTML / CSS / JS
             |
             v
       Express REST API
```

---

## 4. Application Components

### 4.1 Frontend

The frontend will use:

* HTML
* CSS
* Vanilla JavaScript

The frontend is responsible for:

* Accepting long URLs from users
* Sending URL creation requests to the backend API
* Displaying generated short URLs
* Providing a copy-to-clipboard function
* Displaying validation and API errors
* Providing a simple user-friendly interface

The frontend will not directly communicate with PostgreSQL.

All application data access will go through the backend API.

---

### 4.2 Backend API

The backend will use:

* Node.js
* Express
* Prisma ORM
* Jest
* Supertest
* ESLint

The backend is responsible for:

* URL validation
* Short-code generation
* URL creation
* URL lookup
* URL redirection
* Click-count tracking
* Expiration handling where applicable
* API error handling
* Health checks
* Database access through Prisma

The backend exposes REST-style endpoints.

Planned endpoints include:

| Method | Endpoint               | Purpose                      |
| ------ | ---------------------- | ---------------------------- |
| POST   | `/api/urls`            | Create a shortened URL       |
| GET    | `/:shortCode`          | Redirect to the original URL |
| GET    | `/api/urls/:shortCode` | Retrieve URL information     |
| GET    | `/health`              | Application health check     |

---

### 4.3 Database

The database will use PostgreSQL.

Prisma will provide the application data-access layer.

The primary URL record will contain:

| Field          | Purpose                        |
| -------------- | ------------------------------ |
| `id`           | Unique database identifier     |
| `original_url` | Original destination URL       |
| `short_code`   | Unique shortened identifier    |
| `click_count`  | Number of successful redirects |
| `created_at`   | Creation timestamp             |
| `expires_at`   | Optional expiration timestamp  |

The `short_code` field will have a uniqueness constraint to prevent duplicate short identifiers.

Indexes and database constraints will be used where appropriate to improve lookup performance and maintain data integrity.

---

## 5. Container Architecture

The application will use Docker for consistent development and deployment environments.

Docker Compose will manage the local multi-container environment.

Planned services:

```text
+------------------------------------------------+
|              Docker Compose                    |
|                                                |
|  +-------------+       +-------------------+  |
|  |   Backend   | ----> |    PostgreSQL     |  |
|  | Node/Express|       |     Database      |  |
|  +-------------+       +-------------------+  |
|                                                |
|  +-------------+                                |
|  |  Frontend   |                                |
|  | HTML/CSS/JS |                                |
|  +-------------+                                |
+------------------------------------------------+
```

Containers will communicate through a Docker network.

PostgreSQL data will use persistent storage so that database data survives container recreation.

Environment-specific configuration will be supplied through environment variables rather than hard-coded secrets.

---

## 6. AWS Deployment Architecture

The production environment will run on AWS.

Primary AWS components:

* Amazon VPC
* Public subnet
* Internet Gateway
* Security Group
* EC2 instance
* Docker
* Nginx
* Application containers
* PostgreSQL container
* Amazon CloudWatch

High-level AWS architecture:

```text
                         INTERNET
                            |
                            v
                    +---------------+
                    | Internet      |
                    | Gateway       |
                    +-------+-------+
                            |
                            v
                    +---------------+
                    | AWS VPC       |
                    | Public Subnet |
                    +-------+-------+
                            |
                            v
                    +---------------+
                    | EC2 Instance  |
                    |               |
                    |    Nginx      |
                    |       |       |
                    |       v       |
                    |   Backend     |
                    |       |       |
                    |       v       |
                    |  PostgreSQL   |
                    +---------------+
                            |
                            v
                       CloudWatch
```

---

## 7. Network and Security Boundaries

The EC2 security group will restrict inbound traffic to only the ports required by the application.

Expected inbound access:

* HTTP — port 80
* HTTPS — port 443 if TLS is configured
* SSH — port 22, restricted to an appropriate administrative source

The PostgreSQL port will not be exposed publicly.

PostgreSQL will only be accessible from the application container/network.

Application secrets and database credentials will not be committed to Git.

---

## 8. Reverse Proxy

Nginx will act as the public-facing reverse proxy.

Responsibilities include:

* Receiving incoming HTTP requests
* Forwarding application requests to the backend
* Providing a stable public entry point
* Supporting future HTTPS configuration
* Keeping the backend service isolated from direct public access

Traffic flow:

```text
Client
  |
  v
Nginx :80
  |
  v
Express API :5000
  |
  v
PostgreSQL :5432
```

---

## 9. CI/CD Architecture

GitHub Actions will automate the software delivery process.

### Continuous Integration

Pull requests and changes to the main branch will trigger CI checks.

CI will perform:

1. Checkout repository
2. Install dependencies
3. Run ESLint
4. Run automated tests
5. Build the application
6. Build Docker images
7. Validate the application

Conceptual flow:

```text
Developer
    |
    v
Feature Branch
    |
    v
Pull Request
    |
    v
GitHub Actions
    |
    +--> Lint
    |
    +--> Tests
    |
    +--> Build
    |
    +--> Docker Build
    |
    v
Pull Request Review
    |
    v
main
```

---

## 10. Container Registry

GitHub Container Registry (GHCR) will store application container images.

After successful CI and merge to `main`, the deployment pipeline will:

1. Build the Docker image
2. Authenticate with GHCR
3. Tag the image
4. Push the image to GHCR
5. Make the image available to the deployment environment

Conceptual flow:

```text
GitHub Repository
       |
       v
GitHub Actions
       |
       v
Docker Build
       |
       v
GHCR
       |
       v
AWS EC2
```

---

## 11. Continuous Deployment

The deployment workflow will update the application running on AWS EC2.

Expected deployment process:

```text
Merge to main
      |
      v
GitHub Actions
      |
      v
Build Docker Image
      |
      v
Push Image to GHCR
      |
      v
Connect to EC2
      |
      v
Pull Latest Image
      |
      v
Restart Application
      |
      v
Health Check
```

The deployment process should be repeatable and should minimize manual server configuration.

---

## 12. Infrastructure as Code

Terraform will be used to define AWS infrastructure.

Terraform will manage resources such as:

* AWS provider configuration
* VPC/networking resources
* Public subnet
* Internet Gateway
* Route configuration
* Security Group
* EC2 instance
* Required instance configuration

Infrastructure configuration will be stored under:

```text
infrastructure/terraform/
```

Terraform state files and sensitive variable files will not be committed to Git.

---

## 13. Monitoring and Health Checks

The backend will provide:

```text
GET /health
```

The endpoint will be used to verify application availability.

Monitoring will include:

* Application health endpoint
* Docker container status
* EC2 operational monitoring
* Amazon CloudWatch metrics and logs where configured

The deployment pipeline will use health verification to confirm that the application is running after deployment.

---

## 14. Security Design

The project will follow basic application and infrastructure security practices.

### Application Security

* Validate incoming URLs
* Reject malformed requests
* Use secure HTTP headers
* Avoid exposing sensitive configuration
* Handle errors without leaking sensitive information
* Keep dependencies updated

### Configuration Security

Secrets will be stored using environment variables or GitHub Actions secrets.

Examples include:

```text
DATABASE_URL
GHCR credentials
AWS credentials
```

Secrets will not be committed to the repository.

### Infrastructure Security

* Restrict security-group ingress
* Do not expose PostgreSQL publicly
* Restrict SSH access
* Use least-privilege credentials where applicable

---

## 15. Repository Architecture

The planned repository structure is:

```text
url-shortener/
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── config/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── tests/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── infrastructure/
│   └── terraform/
│       ├── main.tf
│       ├── variables.tf
│       ├── outputs.tf
│       └── terraform.tfvars.example
│
├── docs/
│   ├── architecture/
│   │   └── architecture.md
│   ├── deployment.md
│   ├── ci-cd.md
│   └── project-plan.md
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 16. Development Workflow

The team will use the following Git workflow:

```text
main
 |
 +--> Feature Branch
       |
       +--> Development
       |
       +--> Pull Request
              |
              +--> CI Checks
              |
              +--> Code Review
              |
              +--> Squash Merge
                     |
                     v
                    main
```

The `main` branch is protected.

Direct pushes to `main` are not part of the normal development workflow.

---

## 17. Technology Stack

| Layer                  | Technology                |
| ---------------------- | ------------------------- |
| Frontend               | HTML, CSS, JavaScript     |
| Backend                | Node.js, Express          |
| Database               | PostgreSQL                |
| ORM                    | Prisma                    |
| Testing                | Jest, Supertest           |
| Code Quality           | ESLint                    |
| Containers             | Docker, Docker Compose    |
| Source Control         | Git, GitHub               |
| CI/CD                  | GitHub Actions            |
| Registry               | GitHub Container Registry |
| Cloud                  | AWS                       |
| Compute                | Amazon EC2                |
| Reverse Proxy          | Nginx                     |
| Infrastructure as Code | Terraform                 |
| Monitoring             | Amazon CloudWatch         |

---

## 18. Architectural Decisions

### Decision 1 — Vanilla JavaScript frontend

A lightweight HTML/CSS/JavaScript frontend was selected to keep the project focused on DevOps, deployment, automation, and infrastructure rather than frontend framework complexity.

### Decision 2 — Node.js and Express

Node.js with Express provides a lightweight and widely supported environment for implementing the REST API.

### Decision 3 — PostgreSQL

PostgreSQL provides reliable relational storage and is suitable for maintaining URL records, metadata, click counts, and timestamps.

### Decision 4 — Prisma

Prisma provides structured database access, schema management, migrations, and type-safe database interaction.

### Decision 5 — Docker

Docker provides consistent development, testing, and deployment environments.

### Decision 6 — GitHub Actions

GitHub Actions integrates directly with the repository and provides automated CI/CD workflows.

### Decision 7 — AWS EC2

EC2 provides a straightforward cloud compute environment suitable for the project's containerized deployment.

### Decision 8 — Terraform

Terraform allows the AWS infrastructure to be defined as code, making infrastructure changes repeatable and auditable.

### Decision 9 — Nginx

Nginx provides a stable public entry point and reverse proxy between external clients and the application.

### Decision 10 — GHCR

GitHub Container Registry provides an integrated location for storing and distributing Docker images produced by GitHub Actions.

---

## 19. Future Improvements

Potential future improvements include:

* HTTPS with an automated TLS certificate
* Custom domains
* Redis caching
* Rate limiting
* Authentication
* Advanced analytics
* Dedicated managed PostgreSQL such as Amazon RDS
* Load balancing
* Auto Scaling
* Amazon ECS or EKS deployment
* Centralized log aggregation
* Automated rollback strategies

These improvements are outside the initial project scope but provide a path for future scalability.

---

## 20. Architecture Status

**Status:** Approved for implementation

The architecture defined in this document will serve as the baseline for the backend, database, frontend, containerization, CI/CD, infrastructure, deployment, security, and monitoring work.

Any major architectural change should be discussed by the team and documented through a pull request.

# URL Shortener

A containerized URL Shortener application built with Node.js, Express, PostgreSQL, and Prisma. The project demonstrates full-stack application integration, REST API development, relational database management, automated testing, Docker containerization, and CI/CD automation using GitHub Actions and GitHub Container Registry (GHCR).

The project evolved through several stages, from frontend development and API integration to automated validation and publishing a runnable Docker image.

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
- [Running with Docker](#running-with-docker)
- [CI/CD Pipeline](#cicd-pipeline)
- [Testing and Verification](#testing-and-verification)
- [Challenges and Resolutions](#challenges-and-resolutions)
- [Security and Reliability](#security-and-reliability)
- [Lessons Learned](#lessons-learned)
- [Future Improvements](#future-improvements)
- [Project Links](#project-links)

## Project Overview

The URL Shortener provides a web interface and backend API for converting original URLs into shorter links that redirect users to their original destinations.

The application uses PostgreSQL for persistent data storage and Prisma for database access. Docker packages the application into a portable container, while GitHub Actions automates code validation and publishes the container image to GHCR.

The project also provided practical experience in troubleshooting application integration, database connectivity, frontend configuration, container networking, automated testing, and CI/CD failures.

## Key Features

- Generate short links from original URLs.
- Access existing shortened URLs through the dashboard.
- Redirect short links to their original destinations.
- Retrieve application health information through an API endpoint.
- Store application data in PostgreSQL.
- Validate JavaScript code using ESLint.
- Run automated tests with Jest and Supertest.
- Containerize the application using Docker.
- Automate validation through GitHub Actions.
- Publish Docker images to GitHub Container Registry.
- Tag published images with `latest` and commit-specific identifiers.

## Technology Stack

| Category | Technologies |
|---|---|
| Backend | Node.js, Express |
| Frontend | HTML, CSS, JavaScript |
| Database | PostgreSQL |
| Database tooling | Prisma |
| Testing | Jest, Supertest |
| Code quality | ESLint |
| Containerization | Docker |
| CI/CD | GitHub Actions |
| Container registry | GitHub Container Registry |
| Version control | Git, GitHub |

## System Architecture

The application follows a client-server architecture.

1. **Frontend:** Provides the dashboard through which users interact with the URL Shortener.
2. **Backend API:** Processes URL-related requests and handles application logic.
3. **Database:** PostgreSQL stores persistent application data.
4. **Database access:** Prisma provides the database tooling used by the application.
5. **Containerization:** Docker packages the application and its runtime dependencies.
6. **Continuous integration:** GitHub Actions installs dependencies, prepares the database, runs quality checks and tests, and builds the Docker image.
7. **Container publishing:** After successful validation on pushes to `main`, the workflow publishes the image to GHCR.

## Getting Started

### Prerequisites

For local development, install:

- Node.js 22 or a compatible supported version.
- npm.
- PostgreSQL.
- Git.

Docker Desktop is required for container-based execution.

### 1. Clone the repository

```bash
git clone https://github.com/gensfit-collab/url-shortener.git
cd url-shortener
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Configure environment variables

Create a local `.env` file using the environment-variable names expected by the application.

For example, the database connection variable may follow this format:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE_NAME
```

Replace the placeholders with the appropriate local database credentials. Do not commit `.env` files, passwords, or other secrets to GitHub.

### 4. Prepare the database

Ensure PostgreSQL is running and the database connection is configured correctly. Run the database preparation command supported by the Prisma version and migration setup used by the project.

### 5. Start the application

Use the start command defined in `package.json`:

```bash
npm start
```

If the project is being developed on Windows PowerShell and the npm PowerShell script is blocked by the execution policy, use:

```powershell
npm.cmd start
```

The exact startup behavior and required environment variables depend on the project's current configuration.

## Running with Docker

The published image is available from GitHub Container Registry.

**Image:** `ghcr.io/gensfit-collab/url-shortener`

### 1. Pull the image

```bash
docker pull ghcr.io/gensfit-collab/url-shortener:latest
```

### 2. Run the container

```bash
docker run --rm -p 3000:3000 ghcr.io/gensfit-collab/url-shortener:latest
```

If host port `3000` is already occupied, use an alternative host port:

```bash
docker run --rm -p 3001:3000 ghcr.io/gensfit-collab/url-shortener:latest
```

This maps port `3001` on the host to port `3000` inside the container.

### 3. Verify application health

When using the alternative port, run:

```bash
curl http://localhost:3001/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "url-shortener-api"
}
```

The health endpoint was successfully verified against the published container image.

### 4. Access the dashboard

Open the corresponding local address in a browser:

- Default port: `http://localhost:3000`
- Alternative port: `http://localhost:3001`

The dashboard was confirmed to load from the container running on the alternative port.

## CI/CD Pipeline

The GitHub Actions workflow is defined in `.github/workflows/ci.yml`.

### Validation workflow

The `validate` job runs on pull requests and pushes to `main`.

Its steps include:

1. Checking out the repository.
2. Setting up Node.js 22 and npm dependency caching.
3. Installing dependencies with `npm ci`.
4. Preparing the database.
5. Running ESLint.
6. Running automated tests.
7. Running the application build command.
8. Building a Docker image to validate containerization.

The workflow provisions a PostgreSQL service container and configures the database connection for the validation job.

### Container publishing workflow

The `publish` job depends on successful completion of the `validate` job. It runs only when a push targets `main`.

The job:

- Checks out the repository.
- Configures Docker Buildx.
- Authenticates to GHCR using `GITHUB_TOKEN`.
- Generates image metadata and tags.
- Builds and pushes the container image.
- Publishes the `latest` tag and a full commit-SHA tag.

The workflow uses repository read permissions for validation and grants package-write permissions specifically to the publishing job.

This creates a traceable path from a validated source-code revision to its published container image.

## Testing and Verification

The following checks have been completed and recorded during development:

| Check | Result |
|---|---|
| Local automated tests | 9 tests passed across 2 test suites |
| ESLint correction | Subsequent GitHub Actions workflow succeeded |
| GitHub Actions | Successful run confirmed |
| GHCR image pull | Successfully downloaded |
| Docker container execution | Successfully started using host port `3001` |
| Health endpoint | Returned the expected JSON response |
| Dashboard | Loaded successfully from the running container |

These results demonstrate successful validation of the tested version. Additional functional, security, and production-readiness testing may still be required.

## Challenges and Resolutions

### 1. Initial frontend deployment and URL generation

**Challenge:** During the early frontend deployment, the interface was available, but the application could not generate a working short URL as expected.

**Investigation and development:** This exposed the difference between deploying a visible frontend and having a fully integrated application. URL generation depends on the frontend communicating with a functioning backend API, which in turn must process the request and persist the necessary data.

**Engineering lesson:** Validate the complete request flow—from the browser through the API to the database and back—rather than treating a successfully loaded page as proof that the application is fully operational.

**Documentation note:** The exact root cause and resolution of the original deployment issue should be recorded from the corresponding code changes or logs rather than inferred retrospectively.

### 2. Backend, API, and database integration

**Challenge:** The application required the Express API, PostgreSQL database, and Prisma tooling to work together correctly.

**Approach:** Database connection settings, database preparation, API behavior, and automated tests were incorporated into the development and validation process.

**Engineering lesson:** Database connectivity and schema preparation must be verified independently of frontend availability. Successful API startup alone does not prove that database-dependent operations will succeed.

### 3. Windows PowerShell command execution

**Challenge:** PowerShell's execution policy interfered with npm commands that invoked the `npm.ps1` script.

**Resolution:** The Windows command wrappers, including `npm.cmd` and `npx.cmd`, were used to continue executing the required Node.js development commands.

**Outcome:** Development and test commands could be run without changing the system's PowerShell execution policy.

### 4. ESLint browser-global errors in CI

**Challenge:** GitHub Actions failed at the lint stage because ESLint reported browser globals, including `console` and `window`, as undefined in `public/js/app.js`.

**Resolution:** The ESLint configuration was updated to declare the appropriate browser globals for frontend JavaScript files.

**Outcome:** After the correction was committed and pushed, the subsequent GitHub Actions run completed successfully.

### 5. Database preparation in CI

**Challenge:** Automated validation requires a database environment and a schema compatible with the application's database-access layer.

**Approach:** The workflow provisions a PostgreSQL service container and supplies a database connection string before running the database preparation and test steps.

**Engineering lesson:** The migration or schema-preparation command must match the installed Prisma version and the project's actual migration setup. The workflow should be reviewed whenever those dependencies or database scripts change.

### 6. Git and repository collaboration

**Challenge:** Coordinating source changes, commits, branches, pull requests, and automated checks requires the repository to remain consistent across local development and GitHub.

**Approach:** Changes were committed and pushed to GitHub, and the CI workflow was used to validate the updated source.

**Engineering lesson:** Small, focused commits and passing CI checks make errors easier to trace and reduce the risk of unrelated changes being introduced together.

### 7. GHCR hostname-resolution failure

**Challenge:** An initial `docker pull` failed while Docker attempted to resolve the GitHub Container Registry blob-download hostname.

**Resolution:** The image pull was retried later.

**Outcome:** Docker successfully downloaded the image and reported its digest.

**Engineering lesson:** Registry download failures can originate from DNS or network connectivity rather than from a defective Dockerfile or image. Check the underlying error before modifying the application.

### 8. Host port conflict during container startup

**Challenge:** Running the published image with `-p 3000:3000` failed because host port `3000` was already in use.

**Resolution:** The host mapping was changed to `-p 3001:3000`.

**Outcome:** The published image ran on the alternative host port. Its health endpoint returned the expected response, and the dashboard loaded.

**Engineering lesson:** A port conflict on the host does not necessarily indicate that the application port inside the container is incorrect. Host and container ports can be mapped separately.

## Security and Reliability

The following practices are relevant to this project:

- Keep credentials and secrets out of source control.
- Use environment variables for database and environment-specific configuration.
- Restrict database access to trusted application components.
- Review dependency and container-image vulnerabilities.
- Use immutable commit-SHA tags when identifying an exact published image.
- Keep CI permissions limited to the operations each job requires.
- Validate URL inputs and handle invalid requests safely.
- Add structured logging and monitoring appropriate to the deployment environment.

These are operational recommendations and should not be interpreted as confirmation that every security control has already been implemented.

## Lessons Learned

This project reinforced several practical engineering principles:

- A deployed frontend is not the same as a fully working application.
- Frontend, backend, and database integration must be tested end to end.
- Local success and CI success are related but not identical; the CI environment must reproduce the application's requirements.
- ESLint configuration must reflect the environment in which each JavaScript file executes.
- Docker port mapping helps isolate container configuration from host-level conflicts.
- Registry and network errors should be investigated separately from application errors.
- Automated tests and CI checks help catch regressions before container publishing.
- Commit-specific image tags improve traceability between code and artifacts.
- Troubleshooting is most effective when each suspected cause is verified rather than assumed.

## Future Improvements

Potential improvements include:

- Expand automated tests for URL creation, duplicate URLs, invalid inputs, and redirection.
- Confirm and document the exact root cause and resolution of the initial URL-generation issue.
- Add dependency and container-image vulnerability scanning.
- Introduce Docker build caching to reduce build time.
- Improve structured logging, monitoring, and error reporting.
- Implement click analytics if required by the product scope.
- Review database migrations and schema-management practices.
- Document the separate production deployment process once it has been completed and verified.

## Project Links

- **GitHub repository:** https://github.com/gensfit-collab/url-shortener
- **GitHub Actions:** https://github.com/gensfit-collab/url-shortener/actions
- **Container image:** `ghcr.io/gensfit-collab/url-shortener`

## Conclusion

The URL Shortener demonstrates the integration of frontend development, backend API engineering, relational database storage, automated testing, code-quality checks, Docker containerization, and CI/CD-based container publishing.

The development process also provided practical experience in investigating integration failures, correcting lint configuration, handling local networking conflicts, and verifying published container artifacts.

Together, these experiences form a foundation for further work in deployment automation, security, observability, and production operations.
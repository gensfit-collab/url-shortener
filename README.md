# URL Shortener

A containerized URL Shortener application built with modern DevOps practices, CI/CD, and AWS deployment.

## Pull the Published Docker Image

The URL Shortener application is published to GitHub Container Registry (GHCR).

### Pull the latest image

```bash
docker pull ghcr.io/gensfit-collab/url-shortener:latest
```

### Run the container

```bash
docker run --rm -p 3000:3000 ghcr.io/gensfit-collab/url-shortener:latest
```

### Verify the health endpoint

Open http://localhost:3000/health in your browser or run:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "url-shortener-api"
}
```

**Container Registry:** `ghcr.io/gensfit-collab/url-shortener`

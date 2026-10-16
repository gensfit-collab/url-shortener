FROM node:22-bookworm-slim

WORKDIR /app

# Copy dependency manifests first
COPY package*.json ./

# Install OpenSSL (Bookworm ships 3.x, which matches binaryTargets)
RUN apt-get update -y && apt-get install -y openssl

# Clean out any cached deps to avoid RC binaries
RUN rm -rf node_modules package-lock.json

# Install pinned dependencies
RUN npm ci

# Copy the rest of your app
COPY . .

# Generate Prisma client so the right binaries are bundled
RUN npx prisma generate


FROM node:22-bookworm-slim

WORKDIR /app

# Copy dependency manifests first
COPY package*.json ./

# Install OpenSSL (Bookworm ships 3.x, which matches binaryTargets)
RUN apt-get update -y && apt-get install -y openssl

# Clean out node_modules only (keep lockfile!)
RUN rm -rf node_modules

# Install pinned dependencies using lockfile
RUN npm ci

# Copy the rest of your app
COPY . .

# Generate Prisma client so correct binaries are bundled
RUN npx prisma generate


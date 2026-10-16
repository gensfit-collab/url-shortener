FROM node:22-bookworm-slim

WORKDIR /app

# Install OpenSSL (needed by Prisma)
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency manifests and Prisma schema first (better layer caching)
COPY package*.json ./
COPY prisma ./prisma

# Install pinned dependencies using lockfile
RUN npm ci

# Copy the rest of the app
COPY . .

# Generate Prisma client so correct binaries are bundled
RUN npx prisma generate

EXPOSE 5000
CMD ["node", "src/index.js"]

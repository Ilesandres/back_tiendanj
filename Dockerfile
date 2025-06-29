# Etapa 1: Build
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Producción
FROM node:20-slim

# Dependencias para Chromium que usa Puppeteer
RUN apt-get update && apt-get install -y \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    wget \
    ca-certificates \
    libnspr4 \
    libnss3 \
    libdrm2 \
    libxkbcommon0 \
    libxss1 \
    libgtk-3-0 \
    libgbm1 \
    --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Instalar Chrome para Puppeteer
RUN npx puppeteer browsers install chrome

WORKDIR /app

# Copiamos lo necesario desde la etapa de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 8080

CMD ["node", "dist/main.js"]

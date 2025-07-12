# Etapa 1: Build
FROM node:20 AS builder

WORKDIR /app

# Copiar dependencias y hacer build
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Producción
FROM node:20-slim

# Dependencias necesarias para Puppeteer y Chromium
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

# Crear carpeta de trabajo
WORKDIR /app

# Copiar package.json primero para aprovechar el cache de Docker
COPY --from=builder /app/package*.json ./

# Instalar solo las dependencias de producción
RUN npm ci --only=production

# Copiar archivos desde el builder
COPY --from=builder /app/dist ./dist

# ✅ Instalar Puppeteer y descargar Chrome (en producción)
RUN npx puppeteer browsers install chrome

# Exponer puerto de la app Nest
EXPOSE 8080

# Comando de inicio
CMD ["node", "dist/main.js"]

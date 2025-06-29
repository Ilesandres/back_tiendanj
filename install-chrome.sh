#!/bin/bash

echo "Installing Chrome for Puppeteer..."

# Crear directorio de cache
mkdir -p /opt/render/project/src/.cache/puppeteer

# Instalar Chrome usando Puppeteer
npx puppeteer browsers install chrome --force

# Verificar la instalación
echo "Chrome installation completed"
echo "Cache directory: /opt/render/project/src/.cache/puppeteer"

# Listar archivos instalados
ls -la /opt/render/project/src/.cache/puppeteer/ || echo "Cache directory is empty" 
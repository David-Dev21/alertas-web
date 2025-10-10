FROM node:22-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# AGREGA ESTAS LÍNEAS - Crear carpeta .next y dar permisos
RUN mkdir -p .next && \
    chown -R node:node /app && \
    chmod -R 755 /app

# Cambiar a usuario node
USER node

# Exponer puerto
EXPOSE 3000

# Comando para desarrollo
CMD ["npm", "run", "dev"]
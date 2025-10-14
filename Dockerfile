# Dockerfile optimizado para PRODUCCIÓN - Next.js
# Build multi-stage para reducir tamaño

# Stage 1: Dependencies
FROM node:22-alpine AS deps
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --omit=dev

# Stage 2: Builder
FROM node:22-alpine AS builder
WORKDIR /app

# Copiar package.json para instalar todas las dependencias (incluyendo dev)
COPY package*.json ./
RUN npm ci

# Copiar código fuente
COPY . .

# Build de Next.js para producción
ENV NODE_ENV=production
RUN npm run build

# Stage 3: Runner (Producción)
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copiar dependencias de producción
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package*.json ./

# Copiar archivos construidos
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Next.js collect anonymous telemetry data
ENV NEXT_TELEMETRY_DISABLED=1

# Cambiar a usuario no-root
USER node

# Exponer puerto
EXPOSE 3000

# Comando para producción (Next.js standalone o start)
CMD ["npm", "run", "start"]
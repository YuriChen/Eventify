# ========== ETAPA 1: BUILD (Node) ==========
FROM node:22-alpine AS build
WORKDIR /app

# Copia os arquivos de dependência
COPY package.json package-lock.json ./

# Instala as dependências (usa o lock para garantir versões exatas)
RUN npm ci

# Copia o resto do código
COPY . .

# Faz o build de produção do Angular
RUN npm run build -- --configuration production

# ========== ETAPA 2: RUNTIME (Nginx) ==========
FROM nginxinc/nginx-unprivileged:alpine3.22

# Copia a configuração customizada do Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copia APENAS os arquivos estáticos gerados
COPY --from=build /app/dist/eventify-web/browser /usr/share/nginx/html

USER nginx
EXPOSE 8080

ENTRYPOINT ["nginx", "-c", "/etc/nginx/nginx.conf"]
CMD ["-g", "daemon off;"]
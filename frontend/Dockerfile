# Build context is the repo root (see docker-compose.yml) so the shared
# content/ directory resolves during the Vite build.
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies first for better layer caching.
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install

# Source + the shared content directory. Vite resolves the @content alias to
# ../content relative to the frontend dir (i.e. /content here).
COPY frontend/ ./
COPY content /content

ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# --- Runtime: static files via nginx ---
FROM nginx:1.27-alpine
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

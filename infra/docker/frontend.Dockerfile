# Build Stage
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production Stage - NGINX
FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html
# Custom nginx config if necessary
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

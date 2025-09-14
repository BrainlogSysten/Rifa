
FROM node:18-alpine AS development

WORKDIR /app


COPY package*.json ./

RUN npm ci

COPY . .


EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]


FROM node:18-alpine AS builder

WORKDIR /app


COPY package*.json ./


RUN npm ci


COPY . .


RUN npm run build


FROM nginx:alpine AS production


COPY --from=builder /app/dist /usr/share/nginx/html


RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
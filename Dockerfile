# Step 1: Build Stage
FROM node:20.16.0-alpine AS build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Production Stage
FROM nginx:alpine

# Clean default nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy your build correctly
COPY --from=build-stage /app/dist/ /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

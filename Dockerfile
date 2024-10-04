FROM node:18 AS base
WORKDIR /app

# Copy package.json and bun.lockb
COPY package.json .
COPY bun.lockb .

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash

# Add Bun to PATH
ENV BUN_INSTALL="/root/.bun"
ENV PATH="$BUN_INSTALL/bin:$PATH"

# Install dependencies using Bun
RUN bun install --frozen-lockfile
RUN npm install -g @angular/cli
RUN bun install

# --- DEVELOPMENT STAGE ---

FROM base AS development
ENV NODE_ENV=development

COPY . /app

EXPOSE 4200

# Run the app in development mode using ng serve
CMD ["bun", "run", "start"]

# --- BUILD STAGE ---
FROM base AS build

# Copy all files for the build
COPY . /app

RUN ng build --configuration ComputasProd

RUN apt update && apt install -y nginx && \
    rm -rf /var/lib/apt/lists/*

# --- PRODUCTION STAGE ---
FROM nginx:alpine AS production
ENV NODE_ENV=production

# Copy the source code for building the production build
COPY . /app

# Copy built files from the build stage to the Nginx html directory
COPY --from=build /app/dist/tekniskmuseum /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the Nginx port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
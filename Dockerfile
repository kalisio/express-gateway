# Stage 1: Build Stage
FROM node:16-alpine AS builder

LABEL maintainer="Adam MENDE Kalisio"

ARG EG_VERSION
ENV NODE_ENV=production
ENV NODE_PATH=/usr/local/share/.config/yarn/global/node_modules/
ENV EG_CONFIG_DIR=/var/lib/eg
ENV CHOKIDAR_USEPOLLING=true

WORKDIR /app

COPY package.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build application
RUN npm run 
# Stage 2: Production Stage
FROM node:16-alpine

LABEL maintainer="Adam MENDE Kalisio"

ENV NODE_ENV=production
ENV NODE_PATH=/usr/local/share/.config/yarn/global/node_modules/
ENV EG_CONFIG_DIR=/var/lib/eg
ENV CHOKIDAR_USEPOLLING=true

WORKDIR /app

# Copy built files from the builder stage
COPY --from=builder /app ./

EXPOSE 8080 9876

CMD ["npm","run","start"]

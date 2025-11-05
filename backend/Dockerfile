# Stage 1: Build the application (only compile TypeScript)
FROM node:20 AS builder
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Copy source code
COPY . .

# Build TypeScript project
RUN chmod +x ./node_modules/.bin/tsc && ./node_modules/.bin/tsc

# Stage 2: Run the application (install dependencies here)
FROM node:20-alpine
WORKDIR /app

# Install gcsfuse and create mount point
RUN apk add --no-cache fuse gcsfuse && mkdir -p /mnt/data

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies (including better-sqlite3 for alpine)
RUN apk add --no-cache python3 build-base # Install build tools in runtime stage
RUN npm install --legacy-peer-deps # Install all dependencies here

# Copy compiled application code from builder
COPY --from=builder /app/dist ./dist

# Expose the application port (from user's code, it's 8080)
EXPOSE 8080

# Command to run the application
CMD ["npm", "start"]
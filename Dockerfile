# Stage 1: build
FROM node:18-alpine as builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Compile TypeScript -> JavaScript
RUN npm run build

# Stage 2: run
FROM node:18-alpine
WORKDIR /app

# Copy package.json and install only production dependencies
COPY --from=builder /app/package*.json ./
RUN npm install --only=prod

# Copy built application files
COPY --from=builder /app/dist ./dist

# Copy .env file (important for DB connection)
COPY .env .env

# Expose port for app
EXPOSE 3000

# Start the app
CMD ["node", "dist/index.js"]

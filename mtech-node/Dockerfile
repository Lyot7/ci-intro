# MTech Node.js Calculator - Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy application source
COPY app.js ./
COPY test ./test
COPY jest.config.js ./

# Install all dependencies (including dev for testing) and create non-root user
RUN npm ci && \
    npm cache clean --force && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Expose no ports (CLI application)

# Default command: run tests
CMD ["npm", "test"]

# Use official Node.js LTS image
FROM node:18-alpine

# Metadata labels (OCI-compliant)
LABEL org.opencontainers.image.title="gh-actions-npm-cicd-aurora" \
      org.opencontainers.image.description="Node.js app with API integration, modal view, and tests" \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.authors="Amine KAWANI <amine.kawani@outlook.com>" \
      org.opencontainers.image.source="https://github.com/melak-cmd/gh-actions-npm-cicd-aurora" \
      org.opencontainers.image.licenses="MIT"

# Set working directory
WORKDIR /usr/src/app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application source
COPY . .

# Expose port
EXPOSE 3000

# Run as non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Default command
CMD ["node", "index.js"]
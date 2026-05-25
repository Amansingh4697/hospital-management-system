# ── Build stage ───────────────────────────────────────────────
# Build the React app with Vite
FROM node:21-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ── Run stage ──────────────────────────────────────────────────
# Serve with a lightweight web server
FROM node:21-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Expose port and serve the app
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]

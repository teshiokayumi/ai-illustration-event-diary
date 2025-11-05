FROM node:20-alpine

WORKDIR /app

COPY backend ./backend
WORKDIR /app/backend

RUN mkdir -p /mnt/data

RUN npm install --legacy-peer-deps || true
RUN npx tsc || echo "tsc not found, skipping build"

EXPOSE 8080
CMD ["node", "dist/server.js"]

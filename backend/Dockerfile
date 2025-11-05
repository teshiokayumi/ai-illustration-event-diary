FROM node:18

WORKDIR /app

# 共通依存
COPY package*.json ./
RUN npm install

# backend をコピーしてビルド
COPY backend ./backend
WORKDIR /app/backend
RUN npm install
RUN npm run build

# frontend をビルド（存在する場合のみ）
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# 最後に backend に戻って実行
WORKDIR /app/backend
ENV PORT=8080
EXPOSE 8080
CMD ["node", "dist/server.js"]

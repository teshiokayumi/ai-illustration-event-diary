# Node.js 20を使用
FROM node:20

WORKDIR /app

# 共通依存
COPY package*.json ./
RUN npm install

# backendをコピーしてビルド
COPY backend ./backend
WORKDIR /app/backend
RUN npm install
RUN npm run build

# frontendをビルド（※frontendが存在する場合のみ）
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# 最後にバックエンドへ戻って実行
WORKDIR /app/backend
ENV PORT=8080
EXPOSE 8080
CMD ["npm", "start"]

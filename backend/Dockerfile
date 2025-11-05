# Simple single-stage Dockerfile for backend

FROM node:20-alpine

# 作業ディレクトリを設定
WORKDIR /app

# backend フォルダをコピー
COPY backend ./backend

# backend 内に移動
WORKDIR /app/backend

# 必要フォルダを作成
RUN mkdir -p /mnt/data

# 依存関係をインストール
RUN npm install --legacy-peer-deps || true

# TypeScript ビルド（なければスキップ）
RUN npx tsc || echo "tsc not found, skipping build"

# ポートを開放
EXPOSE 8080

# アプリを起動
CMD ["node", "dist/server.js"]

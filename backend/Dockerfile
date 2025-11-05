FROM node:20-alpine

# 作業ディレクトリを作成
WORKDIR /app

# backendフォルダをコピー
COPY backend ./backend

# backendディレクトリへ移動
WORKDIR /app/backend

# gcsfuseはローカル不要なので削除
# RUN apk add --no-cache fuse gcsfuse && mkdir -p /mnt/data
RUN mkdir -p /mnt/data

# 依存関係をインストール
RUN npm install --legacy-peer-deps || true

# TypeScriptをビルド
RUN npx tsc || true

# ポートを開放
EXPOSE 8080

# サーバー起動
CMD ["node", "dist/server.js"]

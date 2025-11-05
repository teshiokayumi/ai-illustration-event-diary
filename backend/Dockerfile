FROM node:20-alpine

# 作業ディレクトリを作成
WORKDIR /app

# backend フォルダの内容だけコピー
COPY backend ./backend

# backendに移動して依存関係をインストール
WORKDIR /app/backend
RUN npm install --legacy-peer-deps || true

# TypeScriptをビルド（tsconfig.jsonがあるため）
RUN npx tsc || true

# 8080ポートを開放
EXPOSE 8080

# サーバーを起動
CMD ["node", "dist/server.js"]

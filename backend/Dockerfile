FROM node:20-alpine

# 作業ディレクトリを作成
WORKDIR /app

# backendフォルダをコピー
COPY backend ./backend

# backendディレクトリへ移動
WORKDIR /app/backend

# Cloud用のgcsfuseは不要。代わりに空フォルダを作成
RUN mkdir -p /mnt/data

# 依存関係をインストール
RUN npm install --legacy-peer-deps || true

# TypeScriptがある場合に備えてtscを実行（無ければスキップ）
RUN npx tsc || echo "tsc not found, skipping build"

# ポートを開放
EXPOSE 8080

# サーバー起動
CMD ["node", "dist/server.js"]

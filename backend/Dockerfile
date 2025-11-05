FROM node:20-alpine

# 作業ディレクトリを作成
WORKDIR /app

# backendフォルダをコピー
COPY backend ./backend

# backendディレクトリへ移動
WORKDIR /app/backend

# gcsfuseはCloud環境専用なので削除。代わりに空のディレクトリだけ作成
RUN mkdir -p /mnt/data

# 依存関係をインストール
RUN npm install --legacy-peer-deps || true

# TypeScriptをビルド
RUN npx tsc || true

# ポートを開放
EXPOSE 8080

# サーバー起動コマンド
CMD ["node", "dist/server.js"]

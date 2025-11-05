FROM node:20-alpine

# 作業ディレクトリを作成
WORKDIR /app

# すべてのファイルをコピー
COPY . .

# backend ディレクトリへ移動
WORKDIR /app/backend

# 依存関係をインストール
RUN npm install --legacy-peer-deps || true

# TypeScript をビルド（もし tsconfig.json がある場合）
RUN npx tsc || true

# コンテナ起動時のコマンド
CMD ["node", "dist/server.js"]

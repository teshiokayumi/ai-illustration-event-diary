# ベースイメージ
FROM node:20-alpine

# 作業ディレクトリ
WORKDIR /app

# ファイルをコピー
COPY . .

# backendディレクトリに移動して依存関係をインストール
WORKDIR /app/backend
RUN npm install

# コンテナ起動時にサーバを実行
CMD ["npm", "start"]

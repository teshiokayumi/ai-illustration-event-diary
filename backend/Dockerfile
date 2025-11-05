# Node.js 公式イメージを使用
FROM node:20

# 作業ディレクトリ
WORKDIR /app

# package.json と package-lock.json をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# ソースコードをコピー
COPY . .

# TypeScript をビルド
RUN npm run build

# コンテナ起動時にアプリを実行
CMD ["npm", "start"]

# Cloud Run が利用するポート
EXPOSE 8080

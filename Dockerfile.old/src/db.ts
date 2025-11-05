// backend/src/db.ts
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// 環境変数でDBパスを指定可能にする
const dbDir = process.env.DB_DIR || path.join(__dirname, '..', 'data');
const dbPath = path.join(dbDir, 'app.db');

console.log(`📁 DB directory: ${dbDir}`);
console.log(`💾 DB path: ${dbPath}`);

// ディレクトリが存在しない場合は作成
if (!fs.existsSync(dbDir)) {
  console.log(`Creating directory: ${dbDir}`);
  fs.mkdirSync(dbDir, { recursive: true });
}

// データベース接続
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// 接続確認
try {
  const result = db.prepare('SELECT 1 as test').get();
  console.log('✅ Database connection successful');
} catch (error) {
  console.error('❌ Database connection failed:', error);
  throw error;
}

export default db;
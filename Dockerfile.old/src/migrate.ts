// backend/src/migrate.ts
import db from './db';

export function runMigrations() {
  // usersテーブル
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      display_name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // eventsテーブル
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      location TEXT NOT NULL,
      organizer_name TEXT NOT NULL,
      fee INTEGER DEFAULT 0,
      contact_info TEXT,
      edit_password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // event_organizersテーブル
  db.exec(`
    CREATE TABLE IF NOT EXISTS event_organizers (
      event_id TEXT,
      user_id TEXT,
      role TEXT, -- 'owner', 'co-organizer'
      PRIMARY KEY (event_id, user_id)
    )
  `);

  // インデックスの作成
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
    CREATE INDEX IF NOT EXISTS idx_events_start_time ON events(start_time);
  `);

  console.log('✅ Database migrations completed');
}

// このファイルを直接実行した場合
if (require.main === module) {
  runMigrations();
  process.exit(0);
}
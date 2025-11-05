/*
import db from './db';

const createTables = () => {
  try {
    // Create users table
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        display_name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create events table
    db.exec(`
      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        start_time DATETIME NOT NULL,
        end_time DATETIME NOT NULL,
        location TEXT NOT NULL,
        organizer_name TEXT NOT NULL,
        fee REAL NOT NULL DEFAULT 0,
        contact_info TEXT,
        edit_password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Create index on start_time for faster queries
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_events_start_time ON events(start_time DESC)
    `);
    
    console.log('✅ Database tables created successfully!');
    console.log('📁 Database location:', db.name);
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
};

try {
  createTables();
  console.log('Migration completed');
  process.exit(0);
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
}
*/
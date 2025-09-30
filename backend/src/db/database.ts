import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let db: Database | null = null;

export async function initDb() {
  if (db) return db;
  db = await open({
    filename: path.join(__dirname, '../../db.sqlite'),
    driver: sqlite3.Database
  });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS songs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      artist TEXT,
      album TEXT,
      year INTEGER,
      filePath TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS user_config (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE,
      value TEXT
    );
  `);
  return db;
}

export function getDb() {
  if (!db) throw new Error('DB not initialized');
  return db;
}

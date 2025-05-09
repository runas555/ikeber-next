import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'market.db');

export async function GET() {
  console.log(`Attempting to connect to database at: ${dbPath}`);

  return new Promise<Response>((resolve) => { // Явно указываем тип Response для Promise
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        console.error(`Error opening database at ${dbPath}:`, err.message);
        resolve(NextResponse.json({ error: 'Failed to connect to the database', details: err.message, path: dbPath }, { status: 500 }));
        return;
      }

      console.log(`Successfully connected to database at: ${dbPath}`);

      db.all('SELECT * FROM items', [], (queryErr, rows) => {
        if (queryErr) {
          console.error('Error querying database:', queryErr.message);
          db.close((closeErr) => {
            if (closeErr) {
              console.error('Error closing database after query error:', closeErr.message);
            }
          });
          resolve(NextResponse.json({ error: 'Failed to query items from the database', details: queryErr.message }, { status: 500 }));
          return;
        }

        // Успешный запрос
        db.close((closeErr) => {
          if (closeErr) {
            console.error('Error closing database after successful query:', closeErr.message);
          }
          console.log(`Successfully queried ${rows.length} items. DB closed.`);
          resolve(NextResponse.json(rows));
        });
      });
    });
  });
}

import sqlite3 from 'sqlite3';
import { itemsData } from './src/data/items.js'; // Adjusted path for .mjs

const db = new sqlite3.Database('./market.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
        return;
    }
    console.log('Connected to the SQLite database.');
});

db.serialize(() => {
    // Create table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price TEXT NOT NULL,
        image TEXT,
        provider TEXT,
        description TEXT
    )`, (err) => {
        if (err) {
            console.error("Error creating table:", err.message);
            return;
        }
        console.log("Table 'items' created or already exists.");

        // Insert data
        const stmt = db.prepare("INSERT INTO items (id, name, category, price, image, provider, description) VALUES (?, ?, ?, ?, ?, ?, ?)");
        let itemsInserted = 0;
        let itemsProcessed = 0;

        if (itemsData.length === 0) {
            console.log("No items to insert.");
            finalizeAndClose();
            return;
        }

        itemsData.forEach(item => {
            // Check if item with this ID already exists
            db.get("SELECT id FROM items WHERE id = ?", [item.id], (err, row) => {
                if (err) {
                    console.error("Error checking for existing item:", item.name, err.message);
                    checkCompletion();
                    return;
                }
                if (row) {
                    console.log(`Item with ID ${item.id} (${item.name}) already exists. Skipping.`);
                    checkCompletion();
                } else {
                    stmt.run(item.id, item.name, item.category, item.price, item.image, item.provider, item.description, function(runErr) {
                        if (runErr) {
                            console.error("Error inserting item:", item.name, runErr.message);
                        } else {
                            itemsInserted++;
                            console.log(`Inserted item: ${item.name} with ID ${this.lastID}`);
                        }
                        checkCompletion();
                    });
                }
            });
        });

        function checkCompletion() {
            itemsProcessed++;
            if (itemsProcessed === itemsData.length) {
                finalizeAndClose();
            }
        }

        function finalizeAndClose() {
            stmt.finalize((finalizeErr) => {
                if (finalizeErr) {
                    console.error("Error finalizing statement:", finalizeErr.message);
                }
                console.log(`${itemsInserted} new items inserted.`);
                db.close((closeErr) => {
                    if (closeErr) {
                        console.error("Error closing database:", closeErr.message);
                    } else {
                        console.log('Database connection closed.');
                    }
                });
            });
        }
    });
});

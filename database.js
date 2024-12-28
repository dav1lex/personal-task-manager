// Connect to SQLite database
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./tasks.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create table
db.run(
    `CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    due_date TEXT,
    status INTEGER DEFAULT 0
  )`,
    (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Tasks table created or already exists.');
        }
    }
);

module.exports = db;

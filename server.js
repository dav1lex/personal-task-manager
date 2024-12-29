const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database'); // Import database

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the frontend
// app.use(express.static(path.join(__dirname, 'frontend')));

// API Endpoints
// GET all tasks
app.get('/api/tasks', (req, res) => {
    db.all('SELECT * FROM tasks', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// GET task by ID
app.get('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).send('Task not found');
        }
        res.json(row);
    });
});

// POST a new task
app.post('/api/tasks', (req, res) => {
    const { name, description, due_date, status = 0 } = req.body;
    db.run(
        'INSERT INTO tasks (name, description, due_date, status) VALUES (?, ?, ?, ?)',
        [name, description, due_date, status],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: this.lastID, ...req.body });
        }
    );
});

// PUT (update) a task
app.put('/api/tasks/:id', (req, res) => {
    const { name, description, due_date, status } = req.body;
    const id = parseInt(req.params.id, 10);
    db.run(
        'UPDATE tasks SET name = ?, description = ?, due_date = ?, status = ? WHERE id = ?',
        [name, description, due_date, status, id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).send('Task not found');
            }
            res.json({ id, ...req.body });
        }
    );
});

// DELETE a task
app.delete('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).send('Task not found');
        }
        res.status(204).send();
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

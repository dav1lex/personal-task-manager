const express = require('express');
const db = require('../database');

const router = express.Router();

// Create a new task
router.post('/tasks', (req, res) => {
    const { name, description, due_date } = req.body;
    db.run(
        `INSERT INTO tasks (name, description, due_date) VALUES (?, ?, ?)`
        , [name, description, due_date], function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(201).json({ id: this.lastID });
            }
        }
    );
});

// Get all tasks
router.get('/tasks', (req, res) => {
    db.all(`SELECT * FROM tasks`, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json(rows);
        }
    });
});

// Update a task
router.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, due_date, status } = req.body;
    db.run(
        `UPDATE tasks SET name = ?, description = ?, due_date = ?, status = ? WHERE id = ?`,
        [name, description, due_date, status, id],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else if (this.changes === 0) {
                res.status(404).json({ error: 'Task not found' });
            } else {
                res.status(200).json({ message: 'Task updated' });
            }
        }
    );
});

// Delete a task
router.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM tasks WHERE id = ?`, [id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json({ message: 'Task deleted' });
        }
    });
});

module.exports = router;
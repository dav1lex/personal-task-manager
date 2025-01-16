const request = require('supertest');
const express = require('express');
const tasksRouter = require('../routes/tasks');
const db = require('../database');

// Createing test
const app = express();
app.use(express.json());
app.use('/', tasksRouter);

// Test case for get endpoint
describe('GET /tasks', () => {
    afterAll((done) => {
        db.close(() => {
            done();
        });
    });

    it('should return all tasks', async () => {
        const response = await request(app)
            .get('/tasks')
            .expect('Content-Type', /json/)
            .expect(200);

        // Check if response array
        expect(Array.isArray(response.body)).toBe(true);

        response.body.forEach(task => {
            expect(task).toHaveProperty('id');
            expect(task).toHaveProperty('name');
            expect(task).toHaveProperty('description');
            expect(task).toHaveProperty('due_date');
            expect(task).toHaveProperty('status');
        });
    });
});
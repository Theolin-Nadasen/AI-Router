import { describe, test, expect } from 'vitest';
import request from 'supertest';
import app from '../index.js';

describe('AI Router API', () => {
    test('GET / should require prompt header', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(400);
        expect(response.text).toBe('please include a prompt header');
    });

    test('GET /models should return models', async () => {
        const response = await request(app).get('/models');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /models with free filter should work', async () => {
        const response = await request(app)
            .get('/models')
            .set('free', 'true');
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /models with only-id should return array of strings', async () => {
        const response = await request(app)
            .get('/models')
            .set('only-id', 'true');
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        if (response.body.length > 0) {
            expect(typeof response.body[0]).toBe('string');
        }
    });
});
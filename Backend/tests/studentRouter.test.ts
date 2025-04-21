import express from 'express';
import request from 'supertest';
import db from '../src/db';

const endpoints = require('../src/routes/studentRouter');

describe('GET /qrCodeBase64', () => {
    test('should return a JSON response', async () => {
        const app = express();
        app.use('/', endpoints.endpoints);
        
        const res = await request(app)
            .get('/qrCodeBase64')
            .query({ email: 'anthony.capper@cix.csi.cuny.edu' });

        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
    });
});

// describe('GET /', () => {
//     test('should return a JSON response', async () => {
//         const studentsRef = db.collection('/Students');
//         const snapshot = await studentsRef.where("cix_email", "==", "anthony.capper@cix.csi.cuny.edu").get();
//         const data = snapshot.docs.map(doc => doc.data());
//         const code = data[0].qrCodeBase64;

//         expect(snapshot.empty).toBe(false);
//         expect(code).toBeDefined();
//     });
// });
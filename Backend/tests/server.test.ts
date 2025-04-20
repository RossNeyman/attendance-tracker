import express from 'express';
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import request from 'supertest';

const endpoints = require('../src/endpoints');

// describe('GET /qrCodeBase64', () => {
//     test('should return a JSON response', async () => {
//         const app = express();
//         app.use('/qrCodeBase64', endpoints.endpoints);
        
//         const res = await request(app)
//             .get('/qrCodeBase64')
//             .query({ email: 'anthony.capper@cix.csi.cuny.edu' });

//         expect(res.status).toBe(200);
//         expect(res.body).toBeDefined();
//     });
// });

// describe('GET /qrCodeBase64', () => {
//     test('should return a JSON response', async () => {
//         const studentsRef = db.collection('/Students');
//         const snapshot = await studentsRef.where("cix_email", "==", "anthony.capper@cix.csi.cuny.edu").get();
//         const data = snapshot.docs.map(doc => doc.data());
//         const code = data[0].qrCodeBase64;

//         expect(snapshot.empty).toBe(false);
//         expect(code).toBeDefined();
//     });
// });
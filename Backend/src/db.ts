//import path from 'path';
//import dotenv from 'dotenv';
//import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const dotenvResult = dotenv.config({ path: path.resolve(__dirname, '../.env') });

// if (dotenvResult.error) {
//   console.error('Error loading .env file:', dotenvResult.error);
// }

// try {
//   if (!admin.apps.length) {
//     admin.initializeApp();
//     console.log('Firebase Admin SDK initialized successfully.');
//   } else {
//     admin.app(); 
//     console.log('Firebase Admin SDK already initialized.');
//   }
// } catch (error) {
//   console.error('Error initializing Firebase Admin SDK:', error);
//   console.error('GOOGLE_APPLICATION_CREDENTIALS at error:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
// }
admin.initializeApp();
//Export singleton db connection
const db = getFirestore();
export default db;

//TODO - IMPLEMENT TOKEN VERIFICATION ON REQUESTS
export async function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized - No token provided or malformed' });
    }
    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = await getAuth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
}
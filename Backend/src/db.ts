import admin from 'firebase-admin';
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

admin.initializeApp();
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
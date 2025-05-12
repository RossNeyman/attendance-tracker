import 'dotenv/config';
import admin from 'firebase-admin';
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const serviceAccountContent = process.env.SERVICE_ACCOUNT_CONTENT;

if (serviceAccountContent) {
  try {
    const serviceAccount = JSON.parse(serviceAccountContent);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin SDK initialized with service account content from environment variable.");
  } catch (error) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_CONTENT or initialize Firebase:", error);
    // Fallback or throw error if critical
    // For example, you might try the default initialization if GOOGLE_APPLICATION_CREDENTIALS is still a valid fallback
    admin.initializeApp(); 
  }
} else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  // Fallback to initializeApp if GOOGLE_APPLICATION_CREDENTIALS (path) is set and the content variable isn't
  admin.initializeApp();
  console.log("Firebase Admin SDK initialized using GOOGLE_APPLICATION_CREDENTIALS path.");
} else {
  console.error("Firebase Admin SDK initialization failed: No credentials provided in environment variables.");
}

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
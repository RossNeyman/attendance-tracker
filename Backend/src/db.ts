import {getFirestore} from "firebase-admin/firestore";
import {initializeApp, applicationDefault, cert} from "firebase-admin/app";
import {ServiceAccount} from "firebase-admin";
import {getAuth} from "firebase-admin/auth";
import serviceAccount from "../serviceAccountKey.json" with {type: "json"};

initializeApp({credential: cert(serviceAccount as ServiceAccount)});

//Export singleton db connection
const db = getFirestore(); 
export default db;

//TODO - IMPLEMENT TOKEN VERIFICATION ON REQUESTS
export async function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decodedToken = await getAuth().verifyIdToken(token); // Use getAuth() here
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}
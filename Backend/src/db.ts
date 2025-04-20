import {getFirestore} from "firebase-admin/firestore";
import {initializeApp, applicationDefault, cert} from "firebase-admin/app";

//Initialize Firebase Admin SDK with service account credentials
const serviceAccount = require("../serviceAccountKey.json");
initializeApp({credential: cert(serviceAccount)});

//Export singleton db connection
const db = getFirestore(); 
export default db;

import {getFirestore} from "firebase-admin/firestore";
import {initializeApp, applicationDefault, cert} from "firebase-admin/app";
import {ServiceAccount} from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json" with {type: "json"};

initializeApp({credential: cert(serviceAccount as ServiceAccount)});

//Export singleton db connection
const db = getFirestore(); 
export default db;

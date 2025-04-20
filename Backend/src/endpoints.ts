import express from "express";
import {getFirestore} from "firebase-admin/firestore";
import {initializeApp, applicationDefault, cert} from "firebase-admin/app";



export const endpoints = express.Router();

// const serviceAccount = require("../serviceAccountKey.json");
// initializeApp({credential: cert(serviceAccount)});

// const db = getFirestore(); 

// endpoints.get("/qrCodeBase64", async (req, res) => {
//     try{
//         const studentsRef = db.collection('/Students');
//         const snapshot = await studentsRef.where("cix_email", "==", req.query.email).get();
//         res.json(snapshot.docs.map(doc => doc.data()));
//     }
//     catch (error) {
//         console.error("Error fetching QR code:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }   
// });
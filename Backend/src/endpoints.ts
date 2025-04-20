import express from "express";
import db from "./db";

export const endpoints = express.Router();

endpoints.get("/students", async (req, res) => {
    try{
        const studentsRef = db.collection('/Students');
        const snapshot = await studentsRef.where("cix_email", "==", req.query.email).get();
        res.json(snapshot.docs.map(doc => doc.data()));
    }
    catch (error) {
        console.error("Error fetching QR code:", error);
        res.status(500).json({ error: "Internal server error" });
    }   
});
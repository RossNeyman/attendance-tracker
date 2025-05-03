import express, { Request, Response } from "express";
import db from "../db";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";

const logsRouter = express.Router();

logsRouter.post('/', async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, roomId, weekId } = req.query;
        const { email } = req.body;

        if (!userId || !roomId || !weekId || !email) {
            return res.status(400).json({ error: "Missing required parameters." });
        }

        const mainRef = db.collection("/Users");

        if(await (await mainRef.where("Document ID", "==", userId).get()).empty) {
            mainRef.doc(userId as string).set({});
        }

        const userDocRef = mainRef.doc(userId as string);
        const roomDocRef = doc(collection(userDocRef, "rooms"), roomId as string);
        const weekDocRef = doc(collection(roomDocRef, "attendance_logs"), weekId as string);

        await setDoc(userDocRef, {}, { merge: true });
        await setDoc(roomDocRef, {}, { merge: true });
        await setDoc(weekDocRef, {}, { merge: true });

        const attendanceRef = collection(weekDocRef, "logs");

        await addDoc(attendanceRef, {
            email,
            timestamp: new Date(),
        });

        res.status(200).json({ message: "Attendance logged successfully." });
    } catch (error) {
        console.error("Error logging attendance:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

logsRouter.put('/', async (req: Request, res: Response): Promise<any> => {
    
});

export default logsRouter;
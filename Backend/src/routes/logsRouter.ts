import express, { Request, Response } from "express";
import db from "../db.js";

const logsRouter = express.Router();

/**
 * Generates a unique identifier for the current week based on the date of the most recent Sunday.
 *
 * @returns {string} A string in the format "Week of MM-DD-YYYY" representing the current week, to be used as the document ID for the week in Firestore.
 *
 * @example
 * If today is May 5, 2025 (Monday), the function will return "Week of 05-04-2025".
 */
function getCurrentWeekId(): string {
    const today = new Date();
    const lastSunday = new Date(today);
    const dayOfWeek = today.getDay();
    if (dayOfWeek !== 0) {
      lastSunday.setDate(today.getDate() - dayOfWeek);
    }
    const month = (lastSunday.getMonth() + 1).toString().padStart(2, '0'); 
    const day = lastSunday.getDate().toString().padStart(2, '0');
    const year = lastSunday.getFullYear();
    return `Week of ${month}-${day}-${year}`;
}


logsRouter.get('/', async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, roomId, weekId } = req.query;
        if (!userId || !roomId || !weekId) {
            return res.status(400).json({ error: "Missing required parameters." });
        }
        const logsRef = db.collection("/Users").doc(userId as string).collection("rooms").doc(roomId as string).collection("weeks").doc(weekId as string).collection("logs");
        const snapshot = await logsRef.get();
        const logs: any[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(logs);
    } catch (error) {
        console.error("Error fetching logs:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});


logsRouter.post('/', async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, roomId } = req.query;
        const { email } = req.body;

        if (!userId || !roomId || !email) {
            return res.status(400).json({ error: "Missing required parameters." });
        }

        const weeksRef = db.collection("/Users").doc(userId as string).collection("rooms").doc(roomId as string).collection("weeks");
        const weekId = getCurrentWeekId();
        await weeksRef.doc(weekId).set({logs:[]});

        await weeksRef.doc(weekId).collection("logs").add({
            email: email,
            timestamp: new Date().toISOString(),
        });
        res.status(200).json({ message: "Attendance logged successfully." });
    } catch (error) {
        console.error("Error logging attendance:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});


logsRouter.put('/', async (req: Request, res: Response): Promise<any> => {
    try {
        const {userId, first_name, last_name, email} = req.body;
        if (!userId || !first_name || !last_name || !email) {
            return res.status(400).json({ error: "Missing userId, first_name, last_name or email parameter." });
        }
        db.collection("/Users").doc(userId).set({
            first_name: first_name,
            last_name: last_name,
            email: email,
            rooms: [],
        });
        
        res.status(200).json({ message: "User saved successfully." });
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

export default logsRouter;
import express, { Request, Response } from "express";
import db from "../db";

const logsRouter = express.Router();

logsRouter.post('/', async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, roomId, weekId } = req.query;
        const { email } = req.body;

        if (!userId || !roomId || !weekId || !email) {
            return res.status(400).json({ error: "Missing required parameters." });
        }

        const attendanceRef = db
            .collection("users")
            .doc(userId as string)
            .collection("rooms")
            .doc(roomId as string)
            .collection("attendanceLogs")
            .doc(weekId as string)
            .collection("logs");

        await attendanceRef.add({
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
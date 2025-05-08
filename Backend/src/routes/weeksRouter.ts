import express, { Request, Response } from "express";
import db from "../db.ts";

const weeksRouter = express.Router();

/**
 * @swagger
 * /weeks/:
 *   get:
 *     summary: Retrieve weeks for a specific user and room
 *     description: This endpoint retrieves weeks for a specific user and room based on the userId and roomId parameters.
 *     responses:
 *       200:
 *         description: Successfully retrieved weeks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: "Weeks retrieved successfully"
 *       500:
 *         description: Internal server error
 */
weeksRouter.get('/', async (req: Request, res: Response): Promise<any> => {
    try { 
        const { userId, roomId } = req.query;
        if (!userId || !roomId) {
            return res.status(400).json({ error: "Missing required parameters." });
        }
        const weeksRef = db.collection("/Users").doc(userId as string).collection("rooms").doc(roomId as string).collection("weeks");
        const snapshot = await weeksRef.get();
        const weeks: any[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(weeks);
    } catch (error) {
        console.error("Error fetching weeks:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

export default weeksRouter;
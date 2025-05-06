import express, { Request, Response } from "express";
import db from "../db.ts";

const roomsRouter = express.Router();

/**
 * @swagger
 * /rooms/:
 *   get:
 *     summary: retrieve all rooms for a user
 *     description: This endpoint retrieves all rooms for a user based on the userId parameter.
 *     responses:
 *       200:
 *         description: Successfully retrieved rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: "Rooms retrieved successfully"
 *       500:
 *         description: Internal server error
 */
roomsRouter.get('/', async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ error: "Missing userId parameter." });
        }
        const roomsRef = db.collection("/Users").doc(userId as string).collection("rooms").where("archived", "==", false);
        const snapshot = await roomsRef.get();
        const rooms: any[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(rooms);
    }
    catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

/**
 * @swagger
 * /rooms/archive:
 *   get:
 *     summary: retrieve all archived rooms for a user
 *     description: This endpoint retrieves all archived rooms for a user based on the userId parameter.
 *     responses:
 *       200:
 *         description: Successfully retrieved archived rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: "Archived rooms retrieved successfully"
 *       500:
 *         description: Internal server error
 */
roomsRouter.get('/archive', async (req: Request, res: Response): Promise<any> => {
    try {
        const {userId} = req.query;
        if (!userId) {
            return res.status(400).json({ error: "Missing userId parameter." });
        }
        const roomsRef = db.collection("/Users").doc(userId as string).collection("rooms").where("archived", "==", true);
        const snapshot = await roomsRef.get();
        const rooms: any[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(rooms);
    }
    catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

/**
 * @swagger
 * /rooms/:
 *   put:
 *     summary: Add a new room for a user
 *     description: This endpoint adds a new room for a user based on the userId and roomName parameters.
 *     responses:
 *       200:
 *         description: Successfully added room
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: "Room added successfully"
 *       500:
 *         description: Internal server error
 */
roomsRouter.put('/', async (req: Request, res: Response): Promise<any> => {
    try {
        const {userId, roomName} = req.body;
        if (!userId || !roomName) {
            return res.status(400).json({ error: "Missing userId or roomName parameter." });
        }
        const userDocRef = db.collection("/Users").doc(userId);
        const roomsRef = userDocRef.collection("rooms");
        await roomsRef.add({room_name: roomName, archived: false, weeks: []}).then(() => {
            return res.status(200).json({ message: "Room saved successfully." });
        });
        
    }
    catch (error) {
        console.error("Error saving room:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

/**
 * @swagger
 * * /rooms/:
 * *   post:
 * *     summary: Update the name of a room for a user
 *  *     description: This endpoint updates the name of a room for a user based on the userId, roomName, and newRoomName parameters.
 * *     responses:
 * *       200:
 * *         description: Successfully updated room name
 * *         content:
 * *           application/json:
 * *             schema:
 * *               type: object
 * *               example:
 * *                 message: "Room name updated successfully"
 * *       500:
 * *         description: Internal server error
 * */
roomsRouter.post('/', async (req: Request, res: Response): Promise<any> => {
    try{
        const { userId, roomName, newRoomName } = req.body;
        if (!userId || !roomName || !newRoomName) {
            return res.status(400).json({ error: "Missing userId, roomName or newRoomName parameter." });
        }
        if(roomName === newRoomName) {
            return res.status(400).json({ error: "New room name is the same as the old one." });
        }
        const userDocRef = db.collection("/Users").doc(userId as string);
        const roomsRef = userDocRef.collection("rooms");
        const roomDocRef = roomsRef.doc(roomName as string);
        await roomDocRef.update({ name: newRoomName });
        res.status(200).json({ message: "Room name updated successfully." });
    }
    catch (error) {
        console.error("Error updating room name:", error);
        res.status(500).json({ error: "Internal server error." });
    }
})

/**
 * @swagger
 * /rooms/archive:
 *   post:
 *     summary: Archive a room for a user
 *     description: This endpoint archives a room for a user based on the userId and roomId parameters.
 *     responses:
 *       200:
 *         description: Successfully archived room
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: "Room archived successfully"
 *       500:
 *         description: Internal server error
 */
roomsRouter.post('/archive', async (req: Request, res: Response): Promise<any> => {
    try{
        const { userId, roomId } = req.body;
        if (!userId || !roomId) {
            return res.status(400).json({ error: "Missing userId or roomId parameter." });
        }
        const userDocRef = db.collection("/Users").doc(userId as string);
        const roomsRef = userDocRef.collection("rooms");
        const roomDocRef = roomsRef.doc(roomId as string);
        await roomDocRef.update({ archived: true });
        res.status(200).json({ message: "Room archived successfully." });
    }
    catch (error) {
        console.error("Error archiving room:", error);
        res.status(500).json({ error: "Internal server error." });
    }
})

/**
 * @swagger
 * /rooms/:
 *   delete:
 *     summary: Delete a room for a user
 *     description: This endpoint deletes a room for a user based on the userId and roomId parameters.
 *     responses:
 *       200:
 *         description: Successfully deleted room
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: "Room deleted successfully"
 *       500:
 *         description: Internal server error
 */
roomsRouter.delete('/', async (req: Request, res: Response): Promise<any> => {
    try {  
        const { userId, roomId } = req.body;
        if (!userId || !roomId) {
            return res.status(400).json({ error: "Missing userId or roomId parameter." });
        }
        const roomDocRef = db.collection("/Users").doc(userId as string).collection("rooms").doc(roomId as string);
        await roomDocRef.delete();
        res.status(200).json({ message: "Room deleted successfully." });
    }
    catch (error) {
        console.error("Error deleting room:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

export default roomsRouter;
import express, { Request, Response } from "express";
import db from "../db.js";

const roomsRouter = express.Router();

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
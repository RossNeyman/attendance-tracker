import express, { Request, Response } from "express";
import db from "../db.ts";
import { doc, setDoc, collection, addDoc, where } from "firebase/firestore";

const logsRouter = express.Router();

logsRouter.post('/', async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, roomId, weekId } = req.query;
        const { email } = req.body;

        if (!userId || !roomId || !weekId || !email) {
            return res.status(400).json({ error: "Missing required parameters." });
        }

        const weeksRef = db.collection("/Users").doc(userId as string).collection("rooms").doc(roomId as string).collection("weeks");

        if(!await weeksRef.where("week_id", "==", weekId as string).get()) {
            weeksRef.doc(weekId as string).set({ logs: [] });
        }

        await weeksRef.doc(weekId as string).collection("logs").add({
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

logsRouter.put('/rooms', async (req: Request, res: Response): Promise<any> => {
    try {
        const {userId, roomName} = req.body;
        if (!userId || !roomName) {
            return res.status(400).json({ error: "Missing userId or roomName parameter." });
        }
        const userDocRef = db.collection("/Users").doc(userId);
        const roomsRef = userDocRef.collection("rooms");
        (await roomsRef.add({room_name: roomName, archived: false, weeks: []})).set({}).then(()=>{
            return res.status(200).json({ message: "Room saved successfully." });
        })

    }
    catch (error) {
        console.error("Error saving room:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

logsRouter.post('/rooms', async (req: Request, res: Response): Promise<any> => {
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

logsRouter.get('/rooms', async (req: Request, res: Response): Promise<any> => {
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

logsRouter.get('/rooms-archive', async (req: Request, res: Response): Promise<any> => {
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

export default logsRouter;
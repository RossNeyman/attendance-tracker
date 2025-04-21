import express from "express";
import db from "../db.ts";

const studentRouter = express.Router();

/**
 * @swagger
 * /students/:
 *   get:
 *     summary: Retrieve student data by cix email
 *     description: This endpoint retrieves student data.
 *     responses:
 *       200:
 *         description: Successfully retrieved data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: "Student data retrieved successfully"
 *       500:
 *         description: Internal server error
 */
studentRouter.get('/', async (req, res) => {
    try{
        const studentsRef = db.collection('/Students');
        const snapshot = await studentsRef.where("cix_email", "==", req.query.email).get();
        res.json(snapshot.docs.map(doc => doc.data()));
    }
    catch (error) {
        console.error("Error fetching student info:", error);
        res.status(500).json({ error: "Internal server error" });
    }   
});

/**
 * @swagger
 * /student/:
 *   put:
 *     summary: Add or update student data
 *     description: This endpoint adds or updates student data based on whether there is an existing document in the Students collection with the same cix email.
 *     responses:
 *       200:
 *         description: Successfully added/updated data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: "Student data added/updated successfully"
 *       500:
 *         description: Internal server error
 */
studentRouter.put('/', async (req, res) => {
    try{
        const studentsRef = db.collection('/Students');
        if(await (await (studentsRef.where("cix_email", "==", req.query.email).get())).empty){
            const docRef = await studentsRef.add(req.body);
            res.status(200).json({message: "Student added successfully"});
        }
        else{
            const docRef = await studentsRef.where("cix_email", "==", req.query.email).get();
            await docRef.docs[0].ref.update(req.body);
            res.status(200).json({message: "Student updated successfully"});
        }
    }
    catch (error) {
        console.error("Error updating student info:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * @swagger
 * /student/:
 *   delete:
 *     summary: Delete student data
 *     description: This endpoint deletes student data for the student with the specified cix email.
 *     responses:
 *       200:
 *         description: Successfully deleted data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: "Student data deleted successfully"
 *       500:
 *         description: Internal server error
 */
studentRouter.delete('/', async (req, res) => {
    try{
        const studentsRef = db.collection('/Students');
        const docRef = await studentsRef.where("cix_email", "==", req.query.email).get();
        await docRef.docs[0].ref.delete();
        res.status(200).json({message: "Student deleted successfully"});
    }
    catch (error) {
        console.error("Error deleting student info:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default studentRouter;
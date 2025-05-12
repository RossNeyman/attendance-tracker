import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import studentRouter from "./routes/studentRouter.js";
import logsRouter from "./routes/logsRouter.js";
import weeksRouter from "./routes/weeksRouter.js";
import roomsRouter from "./routes/roomsRouter.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.config.js";
const app: Application = express();

app.use(cors());
// Makes sure that the server can parse JSON data in requests (figured this one out after about 2 hours)
app.use(express.json());

//directs the requests to the correct router based on the URL path
app.use("/students", studentRouter);
app.use("/logs", logsRouter)
app.use("/weeks", weeksRouter)
app.use("/rooms", roomsRouter)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//This is from a tutorial, now it's used to test
// app.use("/", (req: Request, res: Response, next: NextFunction): void => {
//     res.json({ message: "Allo! Catch-all route." });
// });

export default app;
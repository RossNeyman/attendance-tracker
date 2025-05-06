import express, { Application, Request, Response, NextFunction } from "express";
import studentRouter from "./routes/studentRouter.ts";
import logsRouter from "./routes/logsRouter.ts";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.config.ts";

const app: Application = express();
app.use(express.json());

app.use("/students", studentRouter);
app.use("/logs", logsRouter)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/", (req: Request, res: Response, next: NextFunction): void => {
    res.json({ message: "Allo! Catch-all route." });
});

export default app;
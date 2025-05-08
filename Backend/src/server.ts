import { https } from "firebase-functions";
import app from "./app.js";


//8000 is the default port, unless otherwise specified in the environment variables
const PORT = process.env.PORT || 8080;
app.listen(PORT, (): void => console.log(`running on port ${PORT}`));

export const backend = https.onRequest(app);
import https from "firebase-functions/v2/https";
import app from "./app.js";

//no need to use app.listen() because firebase functions will handle that
//don't need to set a port otherwise it will throw an error
export const backend = https.onRequest(app);
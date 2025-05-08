import https from "firebase-functions/v2/https";
//import { onInit } from "firebase-functions";
import app from "./app.js";


//8000 is the default port, unless otherwise specified in the environment variables
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, (): void => console.log(`running on port ${PORT}`));

// let initiliazedBackend;
// onInit(async () => {
//   initiliazedBackend = await https.onRequest(app);
// });

export const backend = https.onRequest(app);
import app from "./app.ts";

//8000 is the default port, unless otherwise specified in the environment variables
const PORT = process.env.PORT || 8000;
app.listen(PORT, (): void => console.log(`running on port ${PORT}`));
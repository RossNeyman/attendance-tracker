import app from "./app.ts";

const PORT = process.env.PORT || 8000;
app.listen(PORT, (): void => console.log(`running on port ${PORT}`));
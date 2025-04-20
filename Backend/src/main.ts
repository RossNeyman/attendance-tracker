import { createExpressApp } from "./server"

const{app,port} = createExpressApp();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

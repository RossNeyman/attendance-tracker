import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Attendance API",
      version: "1.0.0",
      description: "API Documentation",
    },
  },
  apis: ["./src/routes/*.ts", "./src/*.ts"], 
};

export const swaggerSpec = swaggerJSDoc(options);
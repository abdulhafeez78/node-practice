import swaggerJSDoc from "swagger-jsdoc";
// Swagger definition
("/app");

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Express API with TypeScript and Swagger",
      version: "1.0.0",
      description: "A simple API documentation example",
    },
    servers: [
      {
        url: "http://localhost:8000", // Update according to your setup
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    // security: [
    //   {
    //     bearerAuth: [],
    //   },
    // ],
  },
  apis: ["./app/**/*.ts", "./**/*.ts"], // Ensure this matches your file path
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);

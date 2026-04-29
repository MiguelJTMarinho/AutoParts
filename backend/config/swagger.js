const swaggerJSDoc = require("swagger-jsdoc");
require("dotenv").config();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AutoParts API",
      version: "1.0.0",
      description: "API documentation for AutoParts platform",
    },
    servers: [
      {
        url: process.env.SERVER_URL,
      },
    ],
  },
  apis: ["./routes/*.js"], // onde estão os comentários
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;

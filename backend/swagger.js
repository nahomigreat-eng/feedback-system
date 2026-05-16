const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Feedback System API",
      version: "1.0.0",
      description: "API documentation for Feedback Management System",
    },

    // ✅ IMPORTANT: include /api because your routes use app.use("/api/...")
    servers: [
      {
        url: "https://feedback-system-nrtf.onrender.com/api",
      },
    ],
  },

  // ✅ FIXED: ensure correct path for route scanning
  // (works if swagger.js is inside backend folder)
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
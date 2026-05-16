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

    // ✅ IMPORTANT:
    // Do NOT include /api here because your routes
    // already contain /api in app.use(...)
    servers: [
      {
        url: "https://feedback-system-nrtf.onrender.com",
        description: "Production Server",
      },
    ],
  },

  // ✅ Swagger scans all route files
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

const setupSwagger = (app) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
    })
  );
};

module.exports = setupSwagger;
import swaggerJsdoc from "swagger-jsdoc";
import fs from "fs";
import path from "path";

// Optionally, get version information from package.json.
const packageJson = JSON.parse(
  fs.readFileSync(path.resolve("./package.json"), "utf8"),
);

// Set Swagger JSDoc options.
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TEMPLATE NODEJS API",
      version: packageJson.version || "1.0.0", // Use version from package.json
      description: "Static Swagger documentation for Express API.",
    },
    servers: [
      {
        url: "http://localhost:5000", // Local test server URL
        description: "Localhost server",
      },
      {
        url: "https://dev.example.com",
        description: "Development server",
      },
      {
        url: "https://example.com",
        description: "Production server",
      },
    ],
  },
  // Specify the paths to files containing API annotations.
  apis: ["./src/lib/usecases/api/**/**/*.ts"], // Modify according to your project structure.
};

// Generate Swagger specification (JSON object) based on JSDoc comments.
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// 3. Save the generated specification to a swagger.json file.
if (!fs.existsSync("./out/api-docs")) {
  fs.mkdirSync("./out/api-docs", { recursive: true });
}
fs.copyFileSync(
  path.resolve("./docs/swagger/api-docs.html"),
  path.resolve("./out/api-docs/index.html"),
);
fs.writeFileSync(
  "./out/api-docs/swagger.json",
  JSON.stringify(swaggerSpec, null, 2),
);

console.log(
  "Swagger JSON file has been generated at ./out/api-docs/swagger.json",
);

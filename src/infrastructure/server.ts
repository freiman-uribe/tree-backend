import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import router from "./http/routes";
import { swaggerDocument } from "./swagger/swagger";
import { errorHandler, notFoundHandler } from "./http/middlewares/errorHandler";
import { requestLogger } from "./http/middlewares/requestLogger";
import { logger } from "./utils/logger";

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/tree-api";

// Middleware
app.use(express.json());
app.use(requestLogger);

// Documentación Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rutas de la API
app.use("/api", router);

// Manejador de rutas no encontradas
app.use(notFoundHandler);

// Manejador global de errores
app.use(errorHandler);

// Conexión a MongoDB
mongoose
  .connect(MONGO_URL)
  .then(() => {
    logger.info("Conexión exitosa a MongoDB", { database: MONGO_URL });
  })
  .catch((error) => {
    logger.error("Error al conectar a MongoDB", { error: error.message });
    process.exit(1);
  });

// Manejo de errores no capturados
process.on("unhandledRejection", (reason: any) => {
  logger.error("Unhandled Rejection", { reason });
  process.exit(1);
});

process.on("uncaughtException", (error: Error) => {
  logger.error("Uncaught Exception", { error: error.message, stack: error.stack });
  process.exit(1);
});

// Manejo de cierre graceful
process.on("SIGTERM", () => {
  logger.info("SIGTERM recibido. Cerrando servidor...");
  mongoose.connection.close().then(() => {
    logger.info("MongoDB desconectado");
    process.exit(0);
  });
});

app.listen(PORT, () => {
  logger.info(`API corriendo en http://localhost:${PORT}`);
  logger.info(`Documentación Swagger disponible en http://localhost:${PORT}/api-docs`);
  logger.info(`Entorno: ${process.env.NODE_ENV || "development"}`);
});

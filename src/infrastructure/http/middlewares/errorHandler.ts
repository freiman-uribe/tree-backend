import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../domain/errors/AppError";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Si es un error de aplicación conocido
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }

  // Error de validación de Mongoose
  if (err.name === "ValidationError") {
    return res.status(400).json({
      status: "error",
      message: "Error de validación",
      details: err.message,
    });
  }

  // Error de Cast de MongoDB (ID inválido)
  if (err.name === "CastError") {
    return res.status(400).json({
      status: "error",
      message: "ID inválido",
    });
  }

  // Error desconocido - no exponer detalles en producción
  console.error("ERROR NO CONTROLADO:", err);
  
  return res.status(500).json({
    status: "error",
    message: process.env.NODE_ENV === "development" 
      ? err.message 
      : "Error interno del servidor",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// Middleware para capturar rutas no encontradas
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: `Ruta no encontrada: ${req.method} ${req.path}`,
  });
};

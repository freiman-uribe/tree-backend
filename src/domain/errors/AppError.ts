export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Recurso no encontrado") {
    super(404, message);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = "Error de validación") {
    super(400, message);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Conflicto con el estado actual") {
    super(409, message);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = "Error de base de datos") {
    super(500, message, false);
  }
}

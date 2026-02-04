import { ValidationError } from "../../domain/errors/AppError";

export class NodeValidator {
  static validateId(id: any): void {
    if (id === null || id === undefined) {
      throw new ValidationError("El ID es requerido");
    }

    const numId = Number(id);
    if (isNaN(numId) || !Number.isInteger(numId) || numId < 1) {
      throw new ValidationError("El ID debe ser un número entero positivo");
    }
  }

  static validateParent(parent: any): void {
    if (parent !== null && parent !== undefined) {
      const numParent = Number(parent);
      if (isNaN(numParent) || !Number.isInteger(numParent) || numParent < 1) {
        throw new ValidationError("El campo 'parent' debe ser un número entero positivo o null");
      }
    }
  }

  static validateCreateNodeInput(data: any): void {
    if (!data || typeof data !== "object") {
      throw new ValidationError("Los datos del nodo son requeridos");
    }
    
    if (data.parent !== undefined && data.parent !== null) {
      this.validateParent(data.parent);
    }
  }
}

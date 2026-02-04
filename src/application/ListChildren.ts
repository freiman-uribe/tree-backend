import { NodeRepository } from "../domain/NodeRepository";
import { Node } from "../domain/Node";
import { NodeValidator } from "./validators/NodeValidator";

export class ListChildren {
  constructor(private repo: NodeRepository) {}

  async execute(parentId: number, depth: number = 1): Promise<Node[]> {
    // Validar ID del padre
    NodeValidator.validateId(parentId);
    
    // Validar profundidad
    if (depth < 1) {
      depth = 1;
    }
    
    return this.repo.findChildren(parentId, depth);
  }
}

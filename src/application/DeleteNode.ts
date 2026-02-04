import { NodeRepository } from "../domain/NodeRepository";
import { NodeValidator } from "./validators/NodeValidator";

export class DeleteNode {
  constructor(private repo: NodeRepository) {}

  async execute(id: number): Promise<void> {
    // Validar ID
    NodeValidator.validateId(id);
    
    return this.repo.delete(id);
  }
}

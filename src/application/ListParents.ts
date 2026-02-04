import { NodeRepository } from "../domain/NodeRepository";
import { Node } from "../domain/Node";

export class ListParents {
  constructor(private repo: NodeRepository) {}

  async execute(): Promise<Node[]> {
    return this.repo.findParents();
  }
}

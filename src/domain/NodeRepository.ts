import { Node } from "./Node";

export interface NodeRepository {
  create(node: Node): Promise<Node>;
  findParents(): Promise<Node[]>;
  findChildren(parentId: number, depth?: number): Promise<Node[]>;
  delete(id: number): Promise<void>;
}
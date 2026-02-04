import { NodeRepository } from "../../domain/NodeRepository";
import { Node } from "../../domain/Node";
import { NodeModel } from "./NodeSchema";
import { NotFoundError, ConflictError, DatabaseError, ValidationError } from "../../domain/errors/AppError";

export class MongoNodeRepository implements NodeRepository {
  // Función auxiliar para obtener el siguiente ID
  private async getNextId(): Promise<number> {
    const lastNode = await NodeModel.findOne().sort({ _id: -1 }).lean();
    return lastNode ? lastNode._id + 1 : 1;
  }

  async create(node: Node): Promise<Node> {
    try {
      // Validar que el padre exista si se proporciona
      if (node.parent !== null) {
        const parentExists = await NodeModel.exists({ _id: node.parent });
        if (!parentExists) {
          throw new NotFoundError(`El nodo padre con ID ${node.parent} no existe`);
        }
      }

      // Asignar ID secuencial si no se proporciona
      if (!node.id) {
        node.id = await this.getNextId();
      }

      // Generar title temporal (será actualizado con el idioma correcto por el caso de uso)
      const tempTitle = node.title || `node-${node.id}`;

      const created = await NodeModel.create({ _id: node.id, parent: node.parent, title: tempTitle });
      return { 
        id: node.id,
        parent: created.parent ?? null,
        title: created.title,
        created_at: created.created_at
      };
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      if (error.name === "ValidationError") {
        throw new ValidationError(error.message);
      }
      if (error.code === 11000) {
        throw new ConflictError(`El nodo con ID ${node.id} ya existe`);
      }
      throw new DatabaseError(`Error al crear el nodo: ${error.message}`);
    }
  }

  async findParents(): Promise<Node[]> {
    try {
      const nodes = await NodeModel.find({ parent: null }).lean();
      return nodes.map((n: any) => ({
        id: n._id,
        parent: n.parent ?? null,
        title: n.title,
        created_at: n.created_at
      }));
    } catch (error: any) {
      throw new DatabaseError(`Error al buscar nodos padres: ${error.message}`);
    }
  }

  async findChildren(parentId: number, depth: number = 1): Promise<Node[]> {
    try {
      // Verificar que el padre exista
      const parentExists = await NodeModel.exists({ _id: parentId });
      if (!parentExists) {
        throw new NotFoundError(`El nodo padre con ID ${parentId} no existe`);
      }

      if (depth === 1) {
        // Solo hijos directos
        const nodes = await NodeModel.find({ parent: parentId }).lean();
        return nodes.map((n: any) => ({
          id: n._id,
          parent: n.parent ?? null,
          title: n.title,
          created_at: n.created_at
        }));
      } else {
        // Búsqueda recursiva hasta la profundidad especificada
        return await this.findChildrenRecursive(parentId, depth);
      }
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(`Error al buscar nodos hijos: ${error.message}`);
    }
  }

  private async findChildrenRecursive(parentId: number, depth: number, currentDepth: number = 0): Promise<Node[]> {
    if (currentDepth >= depth) {
      return [];
    }

    const directChildren = await NodeModel.find({ parent: parentId }).lean();
    let allChildren: Node[] = directChildren.map(n => ({
      id: n._id,
      parent: n.parent ?? null,
      title: n.title,
      created_at: n.created_at
    }));

    // Recursivamente obtener los hijos de cada hijo
    for (const child of directChildren) {
      const grandChildren = await this.findChildrenRecursive(child._id, depth, currentDepth + 1);
      allChildren = allChildren.concat(grandChildren);
    }

    return allChildren;
  }

  async delete(id: number): Promise<void> {
    try {
      // Verificar que el nodo exista
      const node = await NodeModel.findOne({ _id: id });
      if (!node) {
        throw new NotFoundError(`El nodo con ID ${id} no existe`);
      }

      // Verificar que no tenga hijos
      const hasChildren = await NodeModel.exists({ parent: id });
      if (hasChildren) {
        throw new ConflictError("No se puede eliminar un nodo que tiene nodos hijos");
      }

      await NodeModel.deleteOne({ _id: id });
    } catch (error: any) {
      if (error instanceof NotFoundError || error instanceof ConflictError) {
        throw error;
      }
      throw new DatabaseError(`Error al eliminar el nodo: ${error.message}`);
    }
  }
}
import { Request, Response } from "express";
import { MongoNodeRepository } from "../../db/MongoNodeRepository";
import { CreateNode } from "../../../application/CreateNode";
import { ListParents } from "../../../application/ListParents";
import { ListChildren } from "../../../application/ListChildren";
import { DeleteNode } from "../../../application/DeleteNode";
import { asyncHandler } from "../middlewares/asyncHandler";
import { ValidationError } from "../../../domain/errors/AppError";
import { TranslationService } from "../../utils/TranslationService";
import { TimezoneService } from "../../utils/TimezoneService";
import { Node } from "../../../domain/Node";

// Instancia única del repositorio
const repo = new MongoNodeRepository();

// Casos de uso
const createNode = new CreateNode(repo);
const listParents = new ListParents(repo);
const listChildren = new ListChildren(repo);
const deleteNode = new DeleteNode(repo);

export class NodeController {
  // Función auxiliar para traducir y formatear nodos
  private static formatNodes(nodes: Node[], language?: string, timezone?: string): any[] {
    return nodes.map(node => ({
      id: node.id,
      parent: node.parent,
      title: language ? TranslationService.translateNumber(node.id, language) : node.title,
      created_at: timezone 
        ? TimezoneService.convertToTimezone(node.created_at, timezone)
        : node.created_at.toISOString().replace('T', ' ').substring(0, 19),
    }));
  }

  static create = asyncHandler(async (req: Request, res: Response) => {
    const { parent } = req.body;
    
    // Obtener idioma del header Accept-Language (formato ISO 639-1)
    const language = req.headers["accept-language"]?.split(',')[0].split('-')[0] || "en";
    
    // El ID se genera automáticamente
    const node = await createNode.execute(parent !== undefined ? (parent === null ? null : Number(parent)) : null, language);
    
    // Aplicar zona horaria si se proporciona
    const timezone = req.headers["timezone"] as string;
    const formattedNode = NodeController.formatNodes([node], language, timezone)[0];
    
    res.status(201).json({
      status: "success",
      data: formattedNode,
    });
  });

  static listParents = asyncHandler(async (req: Request, res: Response) => {
    const nodes = await listParents.execute();
    
    // Obtener idioma y zona horaria
    const language = req.headers["accept-language"]?.split(',')[0].split('-')[0];
    const timezone = req.headers["timezone"] as string;
    
    const formattedNodes = NodeController.formatNodes(nodes, language, timezone);
    
    res.json({
      status: "success",
      results: formattedNodes.length,
      data: formattedNodes,
    });
  });

  static listChildren = asyncHandler(async (req: Request, res: Response) => {
    const { parentId, depth } = req.query;
    
    if (!parentId) {
      throw new ValidationError("El parámetro 'parentId' es requerido");
    }
    
    const depthValue = depth ? Number(depth) : 1;
    
    if (isNaN(depthValue) || depthValue < 1) {
      throw new ValidationError("El parámetro 'depth' debe ser un número entero positivo");
    }
    
    const nodes = await listChildren.execute(Number(parentId), depthValue);
    
    // Obtener idioma y zona horaria
    const language = req.headers["accept-language"]?.split(',')[0].split('-')[0];
    const timezone = req.headers["timezone"] as string;
    
    const formattedNodes = NodeController.formatNodes(nodes, language, timezone);
    
    res.json({
      status: "success",
      results: formattedNodes.length,
      data: formattedNodes,
    });
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    await deleteNode.execute(Number(req.params.id));
    
    res.json({
      status: "success",
      message: "Nodo eliminado exitosamente",
    });
  });
}
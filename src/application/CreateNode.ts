import { NodeRepository } from "../domain/NodeRepository";
import { Node } from "../domain/Node";
import { NodeValidator } from "./validators/NodeValidator";
import { TranslationService } from "../infrastructure/utils/TranslationService";

export class CreateNode {
  constructor(private repo: NodeRepository) {}

  async execute(parent: number | null, language: string = "en"): Promise<Node> {
    // Validar entrada
    NodeValidator.validateCreateNodeInput({ parent });

    const node: Partial<Node> = {
      parent,
      created_at: new Date(),
    };
    
    // El repositorio genera el ID automáticamente con un title temporal
    const createdNode = await this.repo.create(node as Node);
    
    // Generar title correcto con el ID asignado y el idioma solicitado
    const correctTitle = TranslationService.translateNumber(createdNode.id, language);
    
    // Actualizar el título en la base de datos
    await this.updateTitle(createdNode.id, correctTitle);
    
    createdNode.title = correctTitle;
    return createdNode;
  }

  private async updateTitle(id: number, title: string): Promise<void> {
    const NodeModel = require("../infrastructure/db/NodeSchema").NodeModel;
    await NodeModel.updateOne({ _id: id }, { title });
  }
}

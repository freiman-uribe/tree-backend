import "dotenv/config";
import mongoose from "mongoose";
import { NodeModel } from "../infrastructure/db/NodeSchema";

async function seed() {
  try {
    // Conexión a MongoDB
    await mongoose.connect(
        process.env.MONGODB_URI || "mongodb://localhost:27017/tree-api",
    );

    console.log("Conectado a MongoDB");

    // Limpia la colección
    await NodeModel.deleteMany({});
    console.log("Colección limpiada");

    // Precarga de nodos con IDs numéricos secuenciales
    // El title se genera automáticamente como la representación textual del ID en inglés
    
    // Nodos raíz (parent: null)
    await NodeModel.create({ _id: 1, parent: null, title: "one", created_at: new Date() });
    await NodeModel.create({ _id: 5, parent: null, title: "five", created_at: new Date() });
    await NodeModel.create({ _id: 10, parent: null, title: "ten", created_at: new Date() });
    
    // Hijos del nodo 1
    await NodeModel.create({ _id: 2, parent: 1, title: "two", created_at: new Date() });
    await NodeModel.create({ _id: 3, parent: 1, title: "three", created_at: new Date() });
    
    // Hijos del nodo 2 (nietos del nodo 1)
    await NodeModel.create({ _id: 4, parent: 2, title: "four", created_at: new Date() });
    await NodeModel.create({ _id: 6, parent: 2, title: "six", created_at: new Date() });
    
    // Hijos del nodo 5
    await NodeModel.create({ _id: 7, parent: 5, title: "seven", created_at: new Date() });
    await NodeModel.create({ _id: 8, parent: 5, title: "eight", created_at: new Date() });
    
    // Hijos del nodo 7 (nietos del nodo 5)
    await NodeModel.create({ _id: 9, parent: 7, title: "nine", created_at: new Date() });
    
    // Hijos del nodo 10
    await NodeModel.create({ _id: 11, parent: 10, title: "eleven", created_at: new Date() });
    await NodeModel.create({ _id: 12, parent: 10, title: "twelve", created_at: new Date() });

    console.log("Seeder ejecutado correctamente");
    process.exit(0);
  } catch (err) {
    console.error("Error ejecutando el seeder:", err);
    process.exit(1);
  }
}

seed();

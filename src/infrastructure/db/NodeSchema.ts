import { Schema, model } from "mongoose";

const NodeSchema = new Schema({
  _id: { type: Number, required: true }, // Usa id numérico como _id
  parent: { type: Number, default: null },
  title: { type: String, required: true },
  created_at: { type: Date, default: () => new Date() }
}, {
  versionKey: false // Desactiva el campo __v de versioning
});

// Alias para usar 'id' en lugar de '_id'
NodeSchema.virtual('id').get(function() {
  return this._id;
});

NodeSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  }
});

NodeSchema.set('toObject', {
  virtuals: true,
  transform: (doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  }
});

// Índice para búsquedas por parent
NodeSchema.index({ parent: 1 });

export const NodeModel = model("Node", NodeSchema);
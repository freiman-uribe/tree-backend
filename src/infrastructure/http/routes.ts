import { Router } from "express";
import { NodeController } from "./controllers/NodeController";

const router = Router();

router.post("/nodes", NodeController.create);
router.get("/nodes/parents", NodeController.listParents);
router.get("/nodes/children", NodeController.listChildren);
router.delete("/nodes/:id", NodeController.delete);

export default router;

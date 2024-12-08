import express from "express";
import * as portController from "../controllers/portController.js";
const router = express.Router();

router.get("/", portController.getAllPorts);
router.get("/:id", portController.getPortById);

export default router;

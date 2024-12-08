import express from "express";
import * as deviceController from "../controllers/deviceController.js";
const router = express.Router();

router.get("/", deviceController.getAllDevices);
router.get("/:id", deviceController.getDeviceById);

export default router;


import express from "express";
import * as eventController from "../controllers/eventController.js";
const router = express.Router();

router.get("/", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);

export default router;
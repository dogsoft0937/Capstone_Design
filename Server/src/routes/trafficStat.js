import express from "express";
import * as trafficStatController from "../controllers/trafficStatController.js";
const router = express.Router();

router.get("/", trafficStatController.getTrafficStats);
router.get("/:id", trafficStatController.getTrafficStatById);


export default router;

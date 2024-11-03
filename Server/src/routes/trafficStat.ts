import express from "express";
import { Request, Response } from "express";
import { getAllTrafficStats, getTrafficStatById } from "../controllers/trafficStatController";

const router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
    const trafficStats = await getAllTrafficStats();
    res.status(200).json(trafficStats);
});

router.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const trafficStatData = await getTrafficStatById(id);
    if (trafficStatData) {
        res.status(200).json(trafficStatData);
    } else {
        res.status(200).json({ message: "trafficStat not found" });
    }
});

export default router;

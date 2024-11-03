import express from "express";
import { getAllPorts, getPortById } from "../controllers/portController";
import { Request, Response } from "express";
const router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
    const ports = await getAllPorts();
    res.status(200).json(ports);
});
router.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const portData = await getPortById(id);
    if (portData) {
        res.status(200).json(portData);
    } else {
        res.status(200).json({ message: "Port not found" });
    }
});

export default router;

import express from "express";
import { getAllDevices, getDeviceById } from "../controllers/deviceController";
import { Request, Response } from "express";
const router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
    const devices = await getAllDevices();
    console.log(devices);
    res.status(200).json(devices);
});

router.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const deviceData = await getDeviceById(id);
    if (deviceData) {
        res.status(200).json(deviceData);
    } else {
        res.status(200).json({ message: "Device not found" });
    }
});

export default router;

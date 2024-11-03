import express from "express";
import { Request, Response } from "express";
import { getEventById, getAllEvents } from "../controllers/eventController";
const router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
    const events = await getAllEvents();
    res.status(200).json(events);
});

router.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const eventData = await getEventById(id);
    if (eventData) {
        res.status(200).json(eventData);
    } else {
        res.status(200).json({ message: "Event not found" });
    }
});

export default router;

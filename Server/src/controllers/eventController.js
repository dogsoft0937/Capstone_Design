import prisma from '../lib/prisma.js';

export const getAllEvents = async (req, res) => {
    try {
        const events = await prisma.event.findMany();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getEventById = async (req, res) => {
    try {
        const event = await prisma.event.findUnique({
            where: {
                id: req.params.id,
            },
        });
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

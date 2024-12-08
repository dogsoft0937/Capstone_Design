import prisma from '../lib/prisma.js';

export const getAllPorts = async (req, res) => {
    try {
        const ports = await prisma.port.findMany();
        res.json(ports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPortById = async (req, res) => {
    try {
        const port = await prisma.port.findUnique({
            where: { id: req.params.id }
        });
        if (!port) {
            return res.status(404).json({ error: 'Port not found' });
        }
        res.json(port);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

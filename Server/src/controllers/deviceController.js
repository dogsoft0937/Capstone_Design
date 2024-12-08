import prisma from '../lib/prisma.js';

export const getAllDevices = async (req, res) => {
    try {
        const devices = await prisma.device.findMany();
        res.json(devices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getDeviceById = async (req, res) => {
    try {
        const device = await prisma.device.findUnique({
            where: {
                id: req.params.id,
            },
        });
        res.json(device);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

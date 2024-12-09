import prisma from '../lib/prisma.js';
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
});

export const getAllDevices = async (req, res) => {
    try {
        // Redis에서 캐시된 데이터 확인
        const cachedDevices = await redis.get('all_devices');
        
        if (cachedDevices) {
            return res.json(JSON.parse(cachedDevices));
        }

        const devices = await prisma.device.findMany();
        // 데이터를 Redis에 캐싱 (1시간)
        await redis.setex('all_devices', 3600, JSON.stringify(devices));
        res.json(devices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getDeviceById = async (req, res) => {
    try {
        // Redis에서 캐시된 데이터 확인
        const cachedDevice = await redis.get(`device:${req.params.id}`);
        
        if (cachedDevice) {
            return res.json(JSON.parse(cachedDevice));
        }

        const device = await prisma.device.findUnique({
            where: {
                id: req.params.id,
            },
        });
        // 데이터를 Redis에 캐싱 (1시간)
        await redis.setex(`device:${req.params.id}`, 3600, JSON.stringify(device));
        res.json(device);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

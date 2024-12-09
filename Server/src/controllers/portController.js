import prisma from '../lib/prisma.js';
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
});

export const getAllPorts = async (req, res) => {
    try {
        // Redis에서 캐시된 데이터 확인
        const cachedPorts = await redis.get('all_ports');
        
        if (cachedPorts) {
            return res.json(JSON.parse(cachedPorts));
        }

        const ports = await prisma.port.findMany();
        // 데이터를 Redis에 캐싱 (1시간)
        await redis.setex('all_ports', 3600, JSON.stringify(ports));
        res.json(ports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPortById = async (req, res) => {
    try {
        // Redis에서 캐시된 데이터 확인
        const cachedPort = await redis.get(`port:${req.params.id}`);
        
        if (cachedPort) {
            return res.json(JSON.parse(cachedPort));
        }

        const port = await prisma.port.findUnique({
            where: { id: req.params.id }
        });
        if (!port) {
            return res.status(404).json({ error: 'Port not found' });
        }
        // 데이터를 Redis에 캐싱 (1시간)
        await redis.setex(`port:${req.params.id}`, 3600, JSON.stringify(port));
        res.json(port);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

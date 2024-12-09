import prisma from '../lib/prisma.js';
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
});

export const getAllEvents = async (req, res) => {
    try {
        // Redis에서 캐시된 데이터 확인
        const cachedEvents = await redis.get('all_events');
        
        if (cachedEvents) {
            return res.json(JSON.parse(cachedEvents));
        }

        const events = await prisma.event.findMany();
        // 데이터를 Redis에 캐싱 (1시간)
        await redis.setex('all_events', 3600, JSON.stringify(events));
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getEventById = async (req, res) => {
    try {
        // Redis에서 캐시된 데이터 확인
        const cachedEvent = await redis.get(`event:${req.params.id}`);
        
        if (cachedEvent) {
            return res.json(JSON.parse(cachedEvent));
        }

        const event = await prisma.event.findUnique({
            where: {
                id: req.params.id,
            },
        });
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        // 데이터를 Redis에 캐싱 (1시간)
        await redis.setex(`event:${req.params.id}`, 3600, JSON.stringify(event));
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

import prisma from '../lib/prisma.js';
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
});

// BigInt를 문자열로 변환하는 함수
const serializeBigInt = (data) => {
    return JSON.parse(JSON.stringify(data, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
    ));
};

export const getTrafficStats = async (req, res) => {
    try {
        // Redis에서 캐시된 데이터 확인
        const cachedStats = await redis.get('all_traffic_stats');
        
        if (cachedStats) {
            return res.json(JSON.parse(cachedStats));
        }

        const trafficStats = await prisma.trafficStat.findMany({
            include: {
                device: true,
                port: true
            }
        });

        const serializedStats = serializeBigInt(trafficStats);
        // 데이터를 Redis에 캐싱 (1시간)
        await redis.setex('all_traffic_stats', 3600, JSON.stringify(serializedStats));
        res.json(serializedStats);
    } catch (error) {
        console.error('트래픽 통계 조회 오류:', error);
        res.status(500).json({ error: '트래픽 통계 조회 중 오류가 발생했습니다.' });
    }
};

export const getTrafficStatById = async (req, res) => {
    try {
        const { id } = req.params;
        // Redis에서 캐시된 데이터 확인
        const cachedStat = await redis.get(`traffic_stat:${id}`);
        
        if (cachedStat) {
            return res.json(JSON.parse(cachedStat));
        }

        const trafficStat = await prisma.trafficStat.findUnique({
            where: { id },
            include: {
                device: true,
                port: true
            }
        });

        if (!trafficStat) {
            return res.status(404).json({ error: '트래픽 통계를 찾을 수 없습니다.' });
        }

        const serializedStat = serializeBigInt(trafficStat);
        // 데이터를 Redis에 캐싱 (1시간)
        await redis.setex(`traffic_stat:${id}`, 3600, JSON.stringify(serializedStat));
        res.json(serializedStat);
    } catch (error) {
        console.error('트래픽 통계 상세 조회 오류:', error);
        res.status(500).json({ error: '트래픽 통계 조회 중 오류가 발생했습니다.' });
    }
}; 
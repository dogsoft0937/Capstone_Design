import prisma from '../lib/prisma.js';

// BigInt를 문자열로 변환하는 함수
const serializeBigInt = (data) => {
    return JSON.parse(JSON.stringify(data, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
    ));
};

export const getTrafficStats = async (req, res) => {
    try {
        const trafficStats = await prisma.trafficStat.findMany({
            include: {
                device: true,
                port: true
            }
        });

        // BigInt 값을 문자열로 변환하여 응답
        res.json(serializeBigInt(trafficStats));
    } catch (error) {
        console.error('트래픽 통계 조회 오류:', error);
        res.status(500).json({ error: '트래픽 통계 조회 중 오류가 발생했습니다.' });
    }
};

export const getTrafficStatById = async (req, res) => {
    try {
        const { id } = req.params;
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

        // BigInt 값을 문자열로 변환하여 응답
        res.json(serializeBigInt(trafficStat));
    } catch (error) {
        console.error('트래픽 통계 상세 조회 오류:', error);
        res.status(500).json({ error: '트래픽 통계 조회 중 오류가 발생했습니다.' });
    }
}; 
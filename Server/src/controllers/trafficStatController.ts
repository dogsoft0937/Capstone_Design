import { PrismaClient, TrafficStat } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllTrafficStats(): Promise<TrafficStat[]> {
    const trafficStats = await prisma.trafficStat.findMany();
    return trafficStats;
}

export async function getTrafficStatById(id: string): Promise<TrafficStat | null> {
    return prisma.trafficStat.findUnique({
        where: {
            id,
        },
    });
}

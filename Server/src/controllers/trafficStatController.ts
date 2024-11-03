import { PrismaClient, TrafficStat } from "@prisma/client";

const emptyTrafficStats: TrafficStat[] = [
    {
        id: "traffic001",
        timestamp: new Date(),
        inboundTraffic: "100MB",
        outboundTraffic: "50MB",
        deviceId: "device001",
    },
    {
        id: "traffic002",
        timestamp: new Date(),
        inboundTraffic: "150MB",
        outboundTraffic: "80MB",
        deviceId: "device002",
    },
];
export async function getAllTrafficStats() {
    return emptyTrafficStats;
}
export async function getTrafficStatById(id: string) {
    return emptyTrafficStats.find((trafficStat) => trafficStat.id === id);
}
// const prisma = new PrismaClient();

// export async function getAllTrafficStats(): Promise<TrafficStat[]> {
//     const trafficStats = await prisma.trafficStat.findMany();
//     return trafficStats;
// }

// export async function getTrafficStatById(id: string): Promise<TrafficStat | null> {
//     return prisma.trafficStat.findUnique({
//         where: {
//             id,
//         },
//     });
// }

import { Device, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllDevices(): Promise<Device[]> {
    const devices = await prisma.device.findMany();
    return devices;
}

export async function getDeviceById(id: string): Promise<Device | null> {
    return prisma.device.findUnique({
        where: {
            id,
        },
    });
}

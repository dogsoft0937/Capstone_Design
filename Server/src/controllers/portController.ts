import { Port, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllPorts(): Promise<Port[]> {
    const ports = await prisma.port.findMany();
    return ports;
}

export async function getPortById(id: string): Promise<Port | null> {
    return prisma.port.findUnique({
        where: {
            id,
        },
    });
}

import { Event, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllEvents(): Promise<Event[]> {
    const events = await prisma.event.findMany();
    return events;
}

export async function getEventById(id: string): Promise<Event | null> {
    return prisma.event.findUnique({
        where: {
            id,
        },
    });
}

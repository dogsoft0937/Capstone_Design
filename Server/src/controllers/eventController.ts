// import { Event, PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

const emptyEvents = [
    {
      "id": "event001",
      "eventType": "Error",
      "severity": "Critical",
      "message": "Port 1 down",
      "timestamp": "2024-11-06T07:18:20.338Z",
      "deviceId": "device001"
    },
    {
      "id": "event002",
      "eventType": "Normal",
      "severity": "Info",
      "message": "All systems operational",
      "timestamp": "2024-11-06T07:18:20.338Z",
      "deviceId": "device001"
    },
    {
      "id": "event003",
      "eventType": "Error",
      "severity": "Warning",
      "message": "High latency detected",
      "timestamp": "2024-11-06T07:18:20.338Z",
      "deviceId": "device002"
    }
  ];
export async function getAllEvents() {
    return emptyEvents;
}
export async function getEventById(id: string) {
    return emptyEvents.find((event) => event.id === id);
}

// export async function getAllEvents(): Promise<Event[]> {
//     const events = await prisma.event.findMany();
//     return events;
// }

// export async function getEventById(id: string): Promise<Event | null> {
//     return prisma.event.findUnique({
//         where: {
//             id,
//         },
//     });
// }

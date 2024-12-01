// import { Port, PrismaClient } from "@prisma/client";

const emptyPorts =[
    {
      "id": "port001",
      "portNumber": 1,
      "portStatus": "Up",
      "traffic": "500KB/s",
      "errorCount": 0,
      "deviceId": "device001"
    },
    {
      "id": "port002",
      "portNumber": 2,
      "portStatus": "Down",
      "traffic": "0KB/s",
      "errorCount": 1,
      "deviceId": "device001"
    },
    {
      "id": "port003",
      "portNumber": 1,
      "portStatus": "Up",
      "traffic": "300KB/s",
      "errorCount": 0,
      "deviceId": "device002"
    }
  ];
export async function getAllPorts() {
    return emptyPorts;
}
export async function getPortById(id: string) {
    return emptyPorts.find((port) => port.id === id);
}
// const prisma = new PrismaClient();

// export async function getAllPorts(): Promise<Port[]> {
//     const ports = await prisma.port.findMany();
//     return ports;
// }

// export async function getPortById(id: string): Promise<Port | null> {
//     return prisma.port.findUnique({
//         where: {
//             id,
//         },
//     });
// }

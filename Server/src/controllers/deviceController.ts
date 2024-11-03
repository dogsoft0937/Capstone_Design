// import { Device, PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();
const emptyDevices = [
    {
        id: "device001",
        deviceName: "Router A",
        deviceIP: "192.168.1.1",
        status: "Online",
        lastChecked: new Date(),
    },
    {
        id: "device002",
        deviceName: "Switch B",
        deviceIP: "192.168.1.2",
        status: "Online",
        lastChecked: new Date(),
    },
    {
        id: "device003",
        deviceName: "Access Point C",
        deviceIP: "192.168.1.3",
        status: "Offline",
        lastChecked: new Date(),
    },
];
export async function getAllDevices() {
    return emptyDevices;
}
export async function getDeviceById(id: string) {
    const device = emptyDevices.find((device) => device.id === id);
    if (device) {
        return device;
    } else {
        return null;
    }
}
// export async function getAllDevices(): Promise<Device[]> {
//     const devices = await prisma.device.findMany();
//     return devices;
// }

// export async function getDeviceById(id: string): Promise<Device | null> {
//     return prisma.device.findUnique({
//         where: {
//             id,
//         },
//     });
// }

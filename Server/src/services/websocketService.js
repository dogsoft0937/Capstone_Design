import { WebSocketServer } from 'ws';

const server = new WebSocketServer({ port: 8080 });
const connectedClients = new Set();

server.on("connection", (socket) => {
    console.log("새로운 웹소켓 클라이언트 연결됨");
    connectedClients.add(socket);

    socket.on("close", () => {
        console.log("클라이언트 연결 종료");
        connectedClients.delete(socket);
    });
});

export function broadcastTrap(trapInfo) {
    const message = {
        type: "trap",
        data: trapInfo,
    };

    connectedClients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
} 
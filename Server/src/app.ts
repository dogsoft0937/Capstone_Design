import * as WebSocket from "ws";
import express from "express";
import cors from "cors";
import deviceRouter from "./routes/device";
import portRouter from "./routes/port";
import trafficStatRouter from "./routes/trafficStat";
import eventRouter from "./routes/event";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./config/swagger.json";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/devices", deviceRouter);
app.use("/api/ports", portRouter);
app.use("/api/trafficStats", trafficStatRouter);
app.use("/api/events", eventRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const server = new WebSocket.Server({ port: 8080 });

server.on("connection", (socket) => {
    const intervalId = setInterval(() => {
        const responseData = {
            deviceInfo: {
                deviceName: "Switch-1",
                deviceIP: "192.168.1.2",
                status: "Online",
                lastChecked: new Date().toISOString(),
            },
            portInfo: [
                { portNumber: 1, portStatus: "Up", traffic: `${Math.floor(Math.random() * 1000)}KB/s`, errorCount: Math.floor(Math.random() * 10) },
                { portNumber: 2, portStatus: Math.random() > 0.5 ? "Up" : "Down", traffic: `${Math.floor(Math.random() * 1000)}KB/s`, errorCount: Math.floor(Math.random() * 10) },
            ],
            trafficStats: {
                timestamp: new Date().toISOString(),
                inboundTraffic: `${(Math.random() * 5).toFixed(2)}MB`,
                outboundTraffic: `${(Math.random() * 5).toFixed(2)}MB`,
            },
            event: {
                eventType: Math.random() > 0.5 ? "Error" : "Normal",
                severity: Math.random() > 0.5 ? "Warning" : "Info",
                message: Math.random() > 0.5 ? "Port 2 down" : "All systems operational",
            },
        };

        socket.send(JSON.stringify(responseData));
    }, 1000);

    socket.on("close", () => {
        console.log("클라이언트 연결 종료");
        clearInterval(intervalId);
    });
});

const PORT = process.env.PORT || 2306;
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});

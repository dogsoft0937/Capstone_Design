import express from "express";
import cors from "cors";
import deviceRouter from "./routes/device.js";
import portRouter from "./routes/port.js";
import trafficStatRouter from "./routes/trafficStat.js";
import eventRouter from "./routes/event.js";
import swaggerUi from "swagger-ui-express";
import { createRequire } from 'module';
import { startSnmpService } from "./services/snmpService.js";
import './services/websocketService.js';  // WebSocket 서버 초기화

const require = createRequire(import.meta.url);
const swaggerDocs = require("./config/swagger.json");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/devices", deviceRouter);
app.use("/api/ports", portRouter);
app.use("/api/trafficStats", trafficStatRouter);
app.use("/api/events", eventRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const PORT = process.env.PORT || 2306;
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
    startSnmpService();
});

export default app;

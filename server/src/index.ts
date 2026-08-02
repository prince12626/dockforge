import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.config.js";
import { initializeSocket } from "./sockets/index.js";
import http from "node:http";
import { connectRedis } from "./config/redis.config.js";

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

initializeSocket(server);

async function startServer() {
      await connectDB();
      await connectRedis();
      server.listen(PORT, () => {
            console.log("✅ [SUCCESS] SERVER STARTED");
      });
}

startServer();

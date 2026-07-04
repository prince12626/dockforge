import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.config.js";
import { initializeSocket } from "./sockets/index.js";
import http from "node:http";

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

initializeSocket(server);

async function startServer() {
      await connectDB();
      server.listen(PORT, () => {
            console.log(`🚀 ${PORT}`);
      });
}

startServer();
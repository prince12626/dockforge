import express from "express";
import cors from "cors";
import router from "./routes/index.js";

const app = express();

app.use(
      cors({
            origin: "http://localhost:4000",
            credentials: true,
      }),
);

app.use(express.json());
app.use("/api/v1", router);

export default app;

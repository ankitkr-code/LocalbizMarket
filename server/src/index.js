import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import apiRouter from "./routes/index.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: clientOrigin }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "localbizmarket-api" });
});

app.use("/api", apiRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error"
  });
});

app.listen(port, () => {
  console.log(`LocalbizMarket API running on http://localhost:${port}`);
});

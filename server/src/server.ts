import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import router from "./routes";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", router);

app.get("/", (_, res) => res.send("🚀 Issue Tracker API running"));

app.listen(process.env.PORT, () => console.log(`✅ Server on port ${process.env.PORT}`));

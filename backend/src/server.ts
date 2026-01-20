import express, { type Request, type Response } from "express";
import cors from "cors";
import { Pool } from "pg";

import authRouter from "./api/auth";

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
	res.json({ status: "ok!!!!!!" });
});

const PORT = 3000;

app.listen(PORT, () => {
	console.log(`server running on http://localhost:${PORT}`);
});

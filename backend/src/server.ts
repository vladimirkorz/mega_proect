import express from "express";
import cors from "cors";
import dotenv from "dotenv"; 
dotenv.config();
// import { pool } from "./db";

import authRouter from "./api/auth";
import cartRoutes from "./api/cart";

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/api/cart", cartRoutes);
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);

// 3. Добавим лог для проверки, загрузились ли переменные
console.log("DATABASE_URL загружена:", !!process.env.DATABASE_URL);

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

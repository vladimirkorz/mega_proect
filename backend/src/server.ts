import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path"; // 1. Импортируем path
import authRouter from "./api/auth";

// 2. Явно указываем путь к .env (выходим из src в корень)
dotenv.config({ path: path.resolve(__dirname, "../.env") }); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);

// 3. Добавим лог для проверки, загрузились ли переменные
console.log("DATABASE_URL загружена:", !!process.env.DATABASE_URL);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
// backend/src/server.ts
import express from "express";
import cors from "cors";
import authRouter from "./api/auth";
import cartRoutes from "./api/cart";
import adminRouter from "./api/admin";  // ← ДОБАВИТЬ ЭТУ СТРОКУ
import errorHandler from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// Логирование всех запросов
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.path}`);
  next();
});

// Роуты
app.use("/api/auth", authRouter);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRouter);  // ← ЭТО УЖЕ ЕСТЬ, НО НУЖЕН ИМПОРТ ВВЕРХУ

// Тестовый эндпоинт
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Обработка 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Глобальный обработчик ошибок
app.use((err: any, req: any, res: any, next: any) => {
  console.error("🔥 Global error:", err);
  res.status(500).json({ 
    error: "Internal server error",
    details: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
// backend/src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";

interface ErrorWithStatus extends Error {
  status?: number;
  code?: string;
}

export default function errorHandler(
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Error:", err.message);
  console.error("Stack:", err.stack);

  // Ошибки Prisma
  if (err.code === "P2002") {
    return res.status(409).json({
      error: "Unique constraint failed",
      message: "This resource already exists"
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      error: "Not found",
      message: "Resource not found"
    });
  }

  // Кастомные ошибки
  const status = err.status || 500;
  const message = err.message || "Internal server error";

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
}
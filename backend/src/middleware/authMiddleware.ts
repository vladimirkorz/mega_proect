// backend/src/middleware/authMiddleware.ts
import { Response, NextFunction } from "express";
import { AuthRequest } from "../api/auth";
import prisma from "../db";

export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { role: true }
    });

    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admin only." });
    }

    next();
  } catch (error) {
    console.error("Admin check error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
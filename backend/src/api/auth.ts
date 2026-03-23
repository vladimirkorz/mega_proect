// backend/src/api/auth.ts
import { Router, Request, Response } from "express";
import prisma from "../db";
import { hashPass, comparePass } from "../utils/hashPass";
import { generateToken, verifyToken, TokenPayload } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

const router = Router();

// РЕГИСТРАЦИЯ
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Простая валидация
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    if (username.length < 3) {
      return res.status(400).json({ error: "Username must be at least 3 characters" });
    }
    
    if (!email.includes("@")) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // Проверка существования пользователя
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    });

    if (existingUser) {
      const field = existingUser.email === email ? "email" : "username";
      return res.status(409).json({
        error: `User with this ${field} already exists`
      });
    }

    // Хэширование пароля и создание пользователя
    const hashedPass = await hashPass(password);
    const newUser = await prisma.user.create({
      data: { username, email, password: hashedPass },
      select: { id: true, username: true, email: true, createdAt: true }  // ← исправлено
    });

    // Генерация токена
    const token = generateToken({ id: newUser.id, email: newUser.email });

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      token
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ЛОГИН
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, username: true, email: true, password: true, createdAt: true, role: true }  // ← добавили role
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isValidPassword = await comparePass(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken({ id: user.id, email: user.email });

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: "Login successful",
      user: userWithoutPassword,  // Здесь будет role
      token
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ЛОГАУТ
router.post("/logout", async (req: Request, res: Response) => {
  res.json({ message: "Logout successful" });
});

// ПРОВЕРКА ТОКЕНА
router.get("/verify", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ valid: false });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ valid: false });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ valid: false });
    }

    // Получаем пользователя с ролью
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, username: true, email: true, role: true }  // ← добавили role
    });

    if (!user) {
      return res.status(401).json({ valid: false });
    }

    res.json({ valid: true, user });
  } catch (error) {
    res.status(401).json({ valid: false });
  }
});

// MIDDLEWARE для защиты роутов
export const requireAuth = (req: AuthRequest, res: Response, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default router;
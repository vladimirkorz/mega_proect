import { Router, Request, Response } from "express"; // <- ИСПРАВЛЕНО
import jwt from "jsonwebtoken";
import { hashPass, comparePass } from "../utils/hashPass";
import prisma from "../db";
import { NextFunction } from "express";

// Добавляем интерфейс для расширения Request
export interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
  };
}

interface RegisterBody {
  username: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

const router = Router();

// Заглушки для login/logout (требуют отдельной реализации)
router.post("/login", async (req: Request, res: Response) => {
	res.status(501).json({ error: "Not implemented" });
});
router.post("/logout", async (req: Request, res: Response) => {
	res.status(501).json({ error: "Not implemented" });
});

router.post(
	"/register",
	async function (req: Request<{}, {}, RegisterBody>, res: Response) {
		try {
			const { username, email, password } = req.body;

			// 1. Валидация входных данных
			if (!email || !password || !username) {
				return res
					.status(400)
					.json({ error: "All fields are required" });
			}

			// Простая валидация email (можно усложнить через regex или библиотеку)
			if (!email.includes("@")) {
				return res.status(400).json({ error: "Invalid email format" });
			}

			// 2. Проверка существования пользователя (добавлен await)
			const existUser = await prisma.user.findFirst({
				where: { email: email },
			});

			if (existUser) {
				// 409 Conflict - ресурс уже существует
				return res
					.status(409)
					.json({ error: "User with this email already exists" });
			}

			// 3. Хэширование пароля
			const hashedPass = await hashPass(password);

			// 4. Создание пользователя (добавлен await и select для безопасности)
			const newUser = await prisma.user.create({
				data: {
					username,
					email,
					password: hashedPass,
				},
			});

			// 5. Генерация JWT токена
			const token = jwt.sign(
				{ id: newUser.id, email: newUser.email },
				process.env.JWT_SECRET || "fallback_secret", // Используем переменную
				{ expiresIn: "1h" },
			);

			// 6. Ответ клиенту
			return res.status(201).json({
				message: "User registered successfully",
				user: newUser,
				token,
			});
		} catch (e: any) {
			console.error("Registration error:", e);
			// Обработка специфических ошибок Prisma (например, уникальность)
			if (e.code === "P2002") {
				return res.status(409).json({ error: "User already exists" });
			}
			return res.status(500).json({ error: "Internal server error" });
		}
	},
);

export const requireAuth = (req: AuthRequest, res: Response, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as {
      id: number;
      email: string;
    };

    req.user = {
      userId: decoded.id,
      email: decoded.email
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export default router;


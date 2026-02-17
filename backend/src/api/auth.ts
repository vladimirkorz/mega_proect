import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { hashPass, comparePass } from "../utils/hashPass"; // <--- ВАЖНО: добавьте comparePass
import prisma from "../db";

interface RegisterBody {
  username: string;
  email: string;
  password: string;
}

// Интерфейс для входа (нужны только email и пароль)
interface LoginBody {
  email: string;
  password: string;
}

const router = express.Router();

// --- РЕАЛИЗАЦИЯ ВХОДА (LOGIN) ---
router.post("/login", async (req: Request<{}, {}, LoginBody>, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Валидация
    if (!email || !password) {
      return res.status(400).json({ error: "Email и пароль обязательны" });
    }

    // 2. Поиск пользователя в базе
    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    // Если пользователь не найден
    if (!user) {
      return res.status(401).json({ error: "Неверный email или пароль" });
    }

    // 3. Сверка пароля
    // Предполагается, что в utils/hashPass есть функция comparePass
    const isPasswordValid = await comparePass(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Неверный email или пароль" });
    }

    // 4. Генерация JWT токена
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "1h" }
    );

    // 5. Успешный ответ (структура должна совпадать с фронтендом)
    return res.status(200).json({
      message: "Вход успешен",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (e: any) {
    console.error("Login error:", e);
    return res.status(500).json({ error: "Ошибка сервера при входе" });
  }
});

// --- ЗАГЛУШКА ВЫХОДА (LOGOUT) ---
// На клиенте мы просто удаляем токен из localStorage, 
// но если нужна чернаяlista токенов на сервере, реализуйте здесь
router.post("/logout", async (req: Request, res: Response) => {
  res.status(200).json({ message: "Logged out successfully" });
});

// --- РЕГИСТРАЦИЯ (ОСТАЛАСЬ БЕЗ ИЗМЕНЕНИЙ) ---
router.post(
  "/register",
  async function (req: Request<{}, {}, RegisterBody>, res: Response) {
    try {
      const { username, email, password } = req.body;

      if (!email || !password || !username) {
        return res.status(400).json({ error: "All fields are required" });
      }

      if (!email.includes("@")) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      const existUser = await prisma.user.findFirst({
        where: { email: email },
      });

      if (existUser) {
        return res.status(409).json({ error: "User with this email already exists" });
      }

      const hashedPass = await hashPass(password);

      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPass
        },
      });

      const token = jwt.sign(
        { id: newUser.id, email: newUser.email },
        process.env.JWT_SECRET || "fallback_secret",
        { expiresIn: "1h" }
      );

      return res.status(201).json({
        message: "User registered successfully",
        user: newUser,
        token
      });

    } catch (e: any) {
      console.error("Registration error:", e);
      if (e.code === 'P2002') {
        return res.status(409).json({ error: "User already exists" });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;
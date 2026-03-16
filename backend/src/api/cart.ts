// backend/src/api/cart.ts
import { Router, Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import { requireAuth } from "./auth";

// 🔹 1. Создаём экземпляр Prisma (или импортируйте из отдельного файла)
const prisma = new PrismaClient();

// 🔹 2. Определяем тип AuthRequest (если нет в auth.ts)
export interface AuthRequest extends Request {
	user?: {
		id: number; // или string, в зависимости от вашей БД
		email?: string;
		[key: string]: any;
	};
}

const router = Router();

// 🔒 Получить корзину
router.get("/", requireAuth, async (req: AuthRequest, res: Response) => {
	try {
		const userId = req.user!.id;

		const cartItems = await prisma.cartItem.findMany({
			where: { userId },
		});

		res.json(cartItems);
	} catch (error) {
		console.error("Get cart error:", error);
		res.status(500).json({ error: "Ошибка получения корзины" });
	}
});

// 🔒 Добавить товар в корзину
router.post("/add", requireAuth, async (req: AuthRequest, res: Response) => {
	try {
		const userId = req.user!.id;
		const { productId, name, price, image } = req.body;

		if (!productId || !name || !price) {
			return res.status(400).json({ error: "Missing required fields" });
		}

		const existingItem = await prisma.cartItem.findUnique({
			where: {
				userId_productId: { userId, productId },
			},
		});

		if (existingItem) {
			const updatedItem = await prisma.cartItem.update({
				where: { id: existingItem.id },
				data: { quantity: existingItem.quantity + 1 },
			});
			return res.json(updatedItem);
		}

		const newItem = await prisma.cartItem.create({
			data: {
				userId,
				productId,
				name,
				price,
				image: image || null,
				quantity: 1,
			},
		});

		res.json(newItem);
	} catch (error) {
		console.error("Add to cart error:", error);
		res.status(500).json({ error: "Ошибка добавления в корзину" });
	}
});

// 🔒 Удалить товар из корзины
router.delete(
	"/remove/:productId",
	requireAuth,
	async (req: AuthRequest, res: Response) => {
		try {
			const userId = req.user!.id;
			// Превращаем параметр из URL в число для проверки
			const productIdNum = parseInt(req.params.productId as string);

			if (isNaN(productIdNum)) {
				return res.status(400).json({ error: "Invalid product ID" });
			}

			await prisma.cartItem.delete({
				where: {
					// 🔹 ИСПРАВЛЕНИЕ: Преобразуем число обратно в строку для Prisma
					userId_productId: {
						userId,
						productId: productIdNum.toString(),
					},
				},
			});

			res.json({ message: "Товар удалён из корзины" });
			// ...
		} catch (error) {
			console.error("Remove from cart error:", error);
			res.status(500).json({ error: "Ошибка удаления из корзины" });
		}
	},
);

// 🔒 Очистить корзину
router.delete(
	"/clear",
	requireAuth,
	async (req: AuthRequest, res: Response) => {
		try {
			const userId = req.user!.id;

			await prisma.cartItem.deleteMany({
				where: { userId },
			});

			res.json({ message: "Корзина очищена" });
		} catch (error) {
			console.error("Clear cart error:", error);
			res.status(500).json({ error: "Ошибка очистки корзины" });
		}
	},
);

export default router;

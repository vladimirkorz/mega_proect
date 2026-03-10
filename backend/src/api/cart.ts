// backend/src/api/cart.ts
import { Router, Response, NextFunction } from "express";
import prisma from "../db";
import { requireAuth, AuthRequest } from "./auth";

const router = Router();

// 🔒 Получить корзину (только для авторизованных)
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
			// Увеличиваем количество
			const updatedItem = await prisma.cartItem.update({
				where: { id: existingItem.id },
				data: { quantity: existingItem.quantity + 1 },
			});
			return res.json(updatedItem);
		}

		// Создаём новый товар в корзине
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
			const productId = req.params.productId;

			await prisma.cartItem.delete({
				where: {
					userId_productId: { userId, productId },
				},
			});

			res.json({ message: "Товар удалён из корзины" });
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

// backend/src/api/cart.ts
import { Router, Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import { requireAuth } from "../utils/auth"; // Ваш middleware авторизации

const router = Router();
const prisma = new PrismaClient();

// 🔒 Получить корзину (только для авторизованных)
router.get("/", requireAuth, async (req: Request, res: Response) => {
	try {
		const userId = (req as any).user.userId;

		const cartItems = await prisma.cartItem.findMany({
			where: { userId },
		});

		res.json(cartItems);
	} catch (error) {
		res.status(500).json({ error: "Ошибка получения корзины" });
	}
});

// 🔒 Добавить товар в корзину
router.post("/add", requireAuth, async (req: Request, res: Response) => {
	try {
		const userId = (req as any).user.userId;
		const { productId, name, price, image } = req.body;

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
				image,
				quantity: 1,
			},
		});

		res.json(newItem);
	} catch (error) {
		res.status(500).json({ error: "Ошибка добавления в корзину" });
	}
});

// 🔒 Удалить товар из корзины
router.delete(
	"/remove/:productId",
	requireAuth,
	async (req: Request, res: Response) => {
		try {
			const userId = (req as any).user.userId;
			const productId = parseInt(req.params.productId);

			await prisma.cartItem.delete({
				where: {
					userId_productId: { userId, productId },
				},
			});

			res.json({ message: "Товар удалён из корзины" });
		} catch (error) {
			res.status(500).json({ error: "Ошибка удаления из корзины" });
		}
	},
);

// 🔒 Очистить корзину
router.delete("/clear", requireAuth, async (req: Request, res: Response) => {
	try {
		const userId = (req as any).user.userId;

		await prisma.cartItem.deleteMany({
			where: { userId },
		});

		res.json({ message: "Корзина очищена" });
	} catch (error) {
		res.status(500).json({ error: "Ошибка очистки корзины" });
	}
});

export default router;

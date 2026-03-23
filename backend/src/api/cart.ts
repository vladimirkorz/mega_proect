// backend/src/api/cart.ts
import { Router, Request, Response } from "express";
import prisma from "../db";
import { requireAuth, AuthRequest } from "./auth";

const router = Router();

// GET /api/cart - получить корзину пользователя
router.get("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
    
    res.json(cartItems);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// POST /api/cart/sync - синхронизировать всю корзину
router.post("/sync", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { items } = req.body;
    
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: "Items must be an array" });
    }
    
    // Удаляем старые товары
    await prisma.cartItem.deleteMany({
      where: { userId }
    });
    
    // Добавляем новые
    if (items.length > 0) {
      await prisma.cartItem.createMany({
        data: items.map((item: any) => ({
          userId,
          productId: String(item.id), // Приводим к строке
          name: item.name,
          price: item.price,
          image: item.image || null,
          quantity: item.quantity
        }))
      });
    }
    
    res.json({ message: "Cart synced successfully" });
  } catch (error) {
    console.error("Error syncing cart:", error);
    res.status(500).json({ error: "Failed to sync cart" });
  }
});

// POST /api/cart - добавить товар
router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { productId, name, price, image } = req.body;
    
    if (!productId || !name || !price) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const productIdStr = String(productId); // Приводим к строке
    
    // Ищем существующий товар
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: productIdStr
        }
      }
    });
    
    if (existingItem) {
      // Обновляем количество
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: { increment: 1 } }
      });
      res.json(updatedItem);
    } else {
      // Создаем новый
      const newItem = await prisma.cartItem.create({
        data: {
          userId,
          productId: productIdStr,
          name,
          price,
          image: image || null,
          quantity: 1
        }
      });
      res.status(201).json(newItem);
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

// PUT /api/cart/:productId - обновить количество
router.put("/:productId", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const productIdParam = req.params.productId;
    const productId = Array.isArray(productIdParam) ? productIdParam[0] : productIdParam; // Приводим к строке
    const { quantity } = req.body;
    
    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ error: "Invalid quantity" });
    }
    
    if (quantity === 0) {
      // Удаляем товар
      await prisma.cartItem.delete({
        where: {
          userId_productId: {
            userId,
            productId: String(productId) // Приводим к строке
          }
        }
      });
      return res.json({ message: "Item removed" });
    }
    
    // Обновляем количество
    const updatedItem = await prisma.cartItem.update({
      where: {
        userId_productId: {
          userId,
          productId: String(productId) // Приводим к строке
        }
      },
      data: { quantity }
    });
    
    res.json(updatedItem);
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ error: "Failed to update cart item" });
  }
});

// DELETE /api/cart/:productId - удалить товар
router.delete("/:productId", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const productIdParam = req.params.productId;
    const productId = Array.isArray(productIdParam) ? productIdParam[0] : productIdParam; // Приводим к строке
    
    await prisma.cartItem.delete({
      where: {
        userId_productId: {
          userId,
          productId: String(productId) // Приводим к строке
        }
      }
    });
    
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({ error: "Failed to remove cart item" });
  }
});

// DELETE /api/cart/clear - очистить корзину
router.delete("/clear", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    
    await prisma.cartItem.deleteMany({
      where: { userId }
    });
    
    res.json({ message: "Cart cleared" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

export default router;
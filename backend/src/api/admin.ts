// backend/src/api/admin.ts
import { Router } from "express";
import { requireAuth } from "./auth";
import { requireAdmin } from "../middleware/authMiddleware";
import prisma from "../db";

const router = Router();

// Все админ-роуты требуют аутентификацию и права админа
router.use(requireAuth);
router.use(requireAdmin);

// GET /api/admin/products - получить все товары
router.get("/products", async (req, res) => {
  try {
    const products = await prisma.post.findMany({
      orderBy: { id: "desc" }
    });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// POST /api/admin/products - создать товар
router.post("/products", async (req, res) => {
  try {
    const { title, content, price, image, stock } = req.body;
    
    if (!title || !price) {
      return res.status(400).json({ error: "Title and price are required" });
    }

    const product = await prisma.post.create({
      data: {
        title,
        content: content || "",
        price: parseFloat(price),
        image: image || "",
        stock: stock ? parseInt(stock) : 0,
        authorId: (req as any).user.id  // Исправляем тип
      }
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// PUT /api/admin/products/:id - обновить товар
router.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, price, image, stock } = req.body;

    const product = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content,
        price: price ? parseFloat(price) : undefined,
        image,
        stock: stock ? parseInt(stock) : undefined
      }
    });

    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// DELETE /api/admin/products/:id - удалить товар
router.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.post.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;
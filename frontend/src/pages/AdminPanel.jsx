// frontend/src/pages/AdminPanel.jsx
import { useState, useEffect } from "react";
import { api } from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function AdminPanel() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    price: "",
    image: "",
    stock: ""
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await api.get("/admin/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to load products:", error);
      alert("Ошибка загрузки товаров");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // Обновление
        await api.put(`/admin/products/${editingProduct.id}`, formData);
        alert("Товар обновлен");
      } else {
        // Создание
        await api.post("/admin/products", formData);
        alert("Товар создан");
      }
      setEditingProduct(null);
      setFormData({ title: "", content: "", price: "", image: "", stock: "" });
      loadProducts();
    } catch (error) {
      console.error("Failed to save product:", error);
      alert("Ошибка сохранения товара");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Удалить товар?")) return;
    try {
      await api.delete(`/admin/products/${id}`);
      alert("Товар удален");
      loadProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Ошибка удаления товара");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      content: product.content || "",
      price: product.price,
      image: product.image || "",
      stock: product.stock || ""
    });
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Админ-панель</h1>
      <p>Добро пожаловать, {user?.username}!</p>

      <div style={{ marginBottom: "40px" }}>
        <h2>{editingProduct ? "Редактировать товар" : "Создать новый товар"}</h2>
        <form onSubmit={handleSubmit} style={{ maxWidth: "500px" }}>
          <input
            type="text"
            placeholder="Название"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
          />
          <textarea
            placeholder="Описание"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
          />
          <input
            type="number"
            placeholder="Цена"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
            style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
          />
          <input
            type="text"
            placeholder="URL изображения"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
          />
          <input
            type="number"
            placeholder="Количество на складе"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
          />
          <button type="submit" style={{ padding: "10px 20px" }}>
            {editingProduct ? "Обновить" : "Создать"}
          </button>
          {editingProduct && (
            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
                setFormData({ title: "", content: "", price: "", image: "", stock: "" });
              }}
              style={{ marginLeft: "10px", padding: "10px 20px" }}
            >
              Отмена
            </button>
          )}
        </form>
      </div>

      <div>
        <h2>Список товаров</h2>
        <div style={{ display: "grid", gap: "10px" }}>
          {products.map(product => (
            <div key={product.id} style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "5px" }}>
              <h3>{product.title}</h3>
              <p>Цена: {product.price}₽</p>
              <p>Остаток: {product.stock} шт.</p>
              <button onClick={() => handleEdit(product)} style={{ marginRight: "10px" }}>
                Редактировать
              </button>
              <button onClick={() => handleDelete(product.id)} style={{ backgroundColor: "red", color: "white" }}>
                Удалить
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
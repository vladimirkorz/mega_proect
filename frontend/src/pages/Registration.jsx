// src/pages/Registration.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../App.css";

// Создаем экземпляр axios (или импортируйте из api/axios.ts, если создали)
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" },
});

export default function Registration() {
  // 1. Добавили username в состояние
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // 2. Универсальный обработчик изменений
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 3. Отправка запроса на ваш сервер
      const response = await api.post("/auth/register", formData);

      // 4. Сохранение токена и данных пользователя
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      console.log("Регистрация успешна:", response.data);
      
      // 5. Перенаправление на главную
      navigate("/");
    } catch (err) {
      // 6. Обработка ошибок от сервера
      console.error("Ошибка регистрации:", err);
      setError(
        err.response?.data?.error || "Не удалось создать аккаунт. Попробуйте позже."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="login-container"
      style={{ padding: "50px", maxWidth: "400px", margin: "0 auto" }}
    >
      <h2>Создание аккаунта</h2>
      
      {/* Вывод ошибки, если она есть */}
      {error && (
        <p>{error}</p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          className="login-input"
          name="username"
          placeholder="Имя"
          type="text"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          className="login-input"
          name="email"
          placeholder="Почта"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          className="login-input"
          name="password"
          placeholder="Пароль"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        
        <button 
          type="submit" 
          disabled={isLoading}
          style={{ opacity: isLoading ? 0.7 : 1 }}
        >
          {isLoading ? "Создание..." : "Создать"}
        </button>
      </form>

      <button 
        type="button" 
        onClick={() => navigate("/")}
      >
        ← Вернуться на главную
      </button>

      <p>Есть аккаунт?</p>
      {/* Используем Link для SPA навигации без перезагрузки */}
      <Link to="/Login">Войти</Link>
    </div>
  );
}
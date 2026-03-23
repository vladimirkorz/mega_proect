// frontend/src/pages/Registration.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/axios";
import "../App.css";

export default function Registration() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // 👈 Используем login из контекста

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    console.log("Отправка данных на регистрацию:", formData);

    try {
      const response = await api.post("/auth/register", formData);
      
      // 👈 Используем login из контекста вместо прямого доступа к localStorage
      login(response.data.user, response.data.token);

      console.log("Регистрация успешна:", response.data);
      navigate("/");
    } catch (err) {
      console.error("Ошибка регистрации:", err);
      
      // Обработка ошибок валидации
      if (err.response?.data?.errors) {
        const errorMessages = err.response.data.errors
          .map(e => e.message)
          .join(", ");
        setError(errorMessages);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Не удалось создать аккаунт. Попробуйте позже.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ padding: "50px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Создание аккаунта</h2>

      {error && (
        <p style={{ color: "red", background: "#ffeeee", padding: "10px", borderRadius: "5px" }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          className="login-input"
          name="username"
          placeholder="Имя пользователя"
          type="text"
          value={formData.username}
          onChange={handleChange}
          required
          minLength={3}
          maxLength={50}
        />
        
        <input
          className="login-input"
          name="email"
          placeholder="Электронная почта"
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
          minLength={6}
        />

        <button
          type="submit"
          disabled={isLoading}
          style={{ opacity: isLoading ? 0.7 : 1 }}
        >
          {isLoading ? "Создание..." : "Создать аккаунт"}
        </button>
      </form>

      <button type="button" onClick={() => navigate("/")} style={{ marginTop: "10px" }}>
        ← Вернуться на главную
      </button>

      <p style={{ marginTop: "20px" }}>
        Уже есть аккаунт? <Link to="/Login">Войти</Link>
      </p>
    </div>
  );
}
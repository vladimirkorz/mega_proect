// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Registration from "./pages/Registration.jsx";
import Cart from "./pages/Cart.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";  // ← Импортируем админ-панель

import { useAuth } from "./context/AuthContext.jsx";  // ← Для проверки роли

import "./App.css";

// Создаем отдельный компонент для маршрутов, чтобы использовать useAuth
function AppRoutes() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <Routes>
      {/* Публичные маршруты */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
      
      {/* Защищенные маршруты (только для авторизованных) */}
      <Route 
        path="/cart" 
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } 
      />
      
      {/* Админ-панель (только для админов) */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            {user?.role === "admin" ? <AdminPanel /> : <Navigate to="/" />}
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

// Главный компонент App
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
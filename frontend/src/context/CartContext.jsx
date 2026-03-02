// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
	// Загружаем корзину из localStorage при старте (чтобы не терять при обновлении)
	const [cart, setCart] = useState(() => {
		const saved = localStorage.getItem("cart");
		return saved ? JSON.parse(saved) : [];
	});

	// Сохраняем в localStorage при каждом изменении
	useEffect(() => {
		localStorage.setItem("cart", JSON.stringify(cart));

		// 🔥 Здесь позже можно добавить отправку на сервер, если пользователь авторизован:
		// if (user) syncCartWithServer(cart);
	}, [cart]);

	// Добавление товара (с проверкой на дубликаты)
	const addToCart = (product) => {
		setCart((prevCart) => {
			const existing = prevCart.find((item) => item.id === product.id);
			if (existing) {
				// Если товар уже есть — увеличиваем количество
				return prevCart.map((item) =>
					item.id === product.id
						? { ...item, quantity: item.quantity + 1 }
						: item,
				);
			}
			// Иначе добавляем новый с quantity = 1
			return [...prevCart, { ...product, quantity: 1 }];
		});
	};

	// Удаление товара
	const removeFromCart = (productId) => {
		setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
	};

	// Изменение количества
	const updateQuantity = (productId, newQuantity) => {
		if (newQuantity < 1) return removeFromCart(productId);
		setCart((prevCart) =>
			prevCart.map((item) =>
				item.id === productId
					? { ...item, quantity: newQuantity }
					: item,
			),
		);
	};

	// Очистка корзины
	const clearCart = () => setCart([]);

	// Подсчет общей суммы
	const totalPrice = cart.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);

	return (
		<CartContext.Provider
			value={{
				cart,
				addToCart,
				removeFromCart,
				updateQuantity,
				clearCart,
				totalPrice,
				cartCount: cart.reduce((acc, item) => acc + item.quantity, 0),
			}}
		>
			{children}
		</CartContext.Provider>
	);
}

// Хук для удобного использования контекста
export const useCart = () => {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
};

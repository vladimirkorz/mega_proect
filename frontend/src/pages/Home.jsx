import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext.jsx";

// Импорт компонентов
import StatusBar from "../components/StatusBar.jsx";
import NavigationBar from "../components/NavigationBar.jsx";
import Search from "../components/Search.jsx";
import PromotionalBanner from "../components/PromotionalBanner.jsx";
import CategoryCards from "../components/CategoryCards.jsx";
import Goods from "../components/Goods/Goods.jsx"; // 👈 Обрати на путь

export default function Home() {
	const { addToCart } = useCart(); // 👈 Хук работает, т.к. App обернут в CartProvider
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		// Здесь можно загрузить товары с бэкенда
		setIsReady(true);
	}, []);

	if (!isReady) return <div>Загрузка...</div>;

	return (
		<>
			<div className="Baza">
				<StatusBar />
				<NavigationBar />
				<Search />
			</div>
			<div className="App">
				<PromotionalBanner />
				<CategoryCards />
				{/* 👇 Передаём функцию добавления в Goods */}
				<Goods onAddToCart={addToCart} />
			</div>
		</>
	);
}

// src/pages/Home.jsx
import { useState, useEffect } from "react";
import Search from "../components/Search.jsx";
import PromotionalBanner from "../components/PromotionalBanner.jsx";
import NavigationBar from "../components/NavigationBar.jsx";
import CategoryCards from "../components/CategoryCards.jsx";
import Goods from "../components/Goods.jsx";
import StatusBar from "../components/StatusBar.jsx";
import "../App.css"; // Или отдельный CSS для страницы

export default function Home() {
	// Пример использования useState/useEffect (как в вашем комментарии)
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		setIsReady(true);
		// Здесь можно добавить логику загрузки данных и т.д.
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
				<Goods />
			</div>
		</>
	);
}

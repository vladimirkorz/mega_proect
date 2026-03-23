// frontend/src/pages/Home.jsx
import { useState, useEffect } from "react";
import { api } from "../api/axios";
import { useCart } from "../context/CartContext";
import NavigationBar from "../components/NavigationBar";
import CategoryCards from "../components/CategoryCards";
import MenuNavigator from "../components/MenuNavigator";
import PromotionalBanner from "../components/PromotionalBanner";
import Search from "../components/Search";
import StatusBar from "../components/StatusBar";
import Goods from "../components/Goods/Goods"; 

function Home() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const { addToCart } = useCart();

	useEffect(() => {
		loadProducts();
	}, []);

	const loadProducts = async () => {
		try {
			const response = await api.get("/admin/products");
			setProducts(response.data);
		} catch (err) {
			console.error("Failed to load products:", err);
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <div>Загрузка...</div>;

	return (
		<div className="home">
			<StatusBar />
			<NavigationBar />
			<Search />
			<PromotionalBanner />
			<CategoryCards />
			
			
			<Goods 
				goods={products.map(p => ({
					id: p.id,
					name: p.title,
					description: p.content,
					price: p.price,
					image: p.image,
					stock: p.stock
				}))} 
				onAddToCart={addToCart}
			/>
		</div>
	);
}

export default Home;
import { useState } from "react";
import Search from "./components/Search.jsx";
import PromotionalBanner from "./components/PromotionalBanner.jsx";
import NavigationBar from "./components/NavigationBar.jsx";
import CategoryCards from "./components/CategoryCards.jsx";
import Goods from "./components/Goods.jsx";
import StatusBar from "./components/StatusBar.jsx";
import "./App.css";

function App() {
	// нужно пользоваться useState и useEffect
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

export default App;

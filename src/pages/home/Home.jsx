import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { BrowserRouter } from "react-router-dom";
function Home() {
	return (
		<div className="Home">
			<BrowserRouter>
				{/* Header*/}
				<Header />
				{/*Sidebar*/}
				<Sidebar />
			</BrowserRouter>
			{/*Chat Screen*/}
		</div>
	);
}

export default Home;

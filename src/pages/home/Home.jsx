import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import Chat from "../../components/Chat";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function Home() {
	return (
		<div className="Home">
			<BrowserRouter>
				{/* Header*/}
				<Header />
				<main
					className="flex flex-col md:flex-row items-stretch"
					style={{ minHeight: "calc(100vh - 56px)" }}
				>
					{/*Sidebar*/}
					<Sidebar />
					<Routes>
						<Route path="/room/:roomId" element={<Chat />} />
					</Routes>
				</main>
			</BrowserRouter>
			{/*Chat Screen*/}
		</div>
	);
}

export default Home;

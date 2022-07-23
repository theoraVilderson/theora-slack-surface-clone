import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import Chat from "../../components/Chat";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useGlobalContext } from "../../context/globalContext";
import { actions } from "../../data/db";

import { actionTypes } from "../../reducer/globalReducer";
import { useEffect } from "react";
function Home() {
	const [{ user }, dispatch] = useGlobalContext();
	useEffect(() => {
		const unsub = actions.userListener(user.id, function (unsub, data) {
			console.log(data.data());
			dispatch({
				type: actionTypes.SET_USER,
				payload: { user: { id: data.id, ...data.data() } },
			});
		});
		return unsub;
	}, []); // eslint-disable-line react-hooks/exhaustive-deps
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

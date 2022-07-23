import "./Login.css";
import logo from "../../assets/logo.svg";
import { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import { useGlobalContext } from "../../context/globalContext";
import { actionTypes } from "../../reducer/globalReducer";
import {
	signInWithPopup,
	signInWithRedirect,
	getRedirectResult,
	googleProvider,
	auth,
	actions,
} from "../../data/db";

import { isMobile } from "react-device-detect";
function Login() {
	const [redirectLoadingDone, setRedirectLoadingDone] = useState(false);
	const [activeLoginProcess, setActiveLoginProcess] = useState(false);
	const [{ user }, dispatch] = useGlobalContext();
	const [logedIn, setLogedIn] = useState(false);

	const logUserIn = async (user) => {
		// log user in

		const userData = {
			userImage: user.photoURL,
			userName: user.displayName,
			email: user.email,
			userId: user.uid,
		};
		try {
			const user = await actions.storeUser(userData);
			dispatch({ type: actionTypes.SET_USER, payload: { user } });
		} catch (e) {
			alert("failed to login");
		}
	};
	const loginWithGoogle = () => {
		setActiveLoginProcess(true);
		if (!isMobile) {
			return signInWithPopup(auth, googleProvider)
				.then((result) => {
					if (result?.user) {
						logUserIn(result?.user);
					}
					setLogedIn(true);
				})
				.catch((e) => {})
				.finally((e) => {
					return setActiveLoginProcess(false);
				});
		}
		signInWithRedirect(auth, googleProvider);
	};

	useEffect(() => {
		if (user) return setRedirectLoadingDone(true);
		getRedirectResult(auth)
			.then((result) => {
				if (result?.user) {
					logUserIn(result?.user);
				}
				return result;
			})
			.catch((e) => {})

			.finally((e) => {
				setRedirectLoadingDone(true);
			});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return !redirectLoadingDone ? (
		<Loading />
	) : (
		<div className="Login flex justify-center items-center bg-gray-100 min-h-screen">
			<div className=" text-center p-5 box flex justify-center items-center gap-7 flex-col container shadow max-w-[500px] w-full md:w-1/2 bg-white h-full max-h-[400px]">
				<img src={logo} alt="logo" className="w-24 h-24" />
				<div>
					<h2 className="text-3xl font-black p-2">
						Sign in To Slack With Google
					</h2>
					<h5>{window.location.origin}</h5>
				</div>
				<button
					disabled={activeLoginProcess || logedIn}
					onClick={loginWithGoogle}
					className="btn p-2 bg-green-500 disabled:bg-red-500 disabled:cursor-not-allowed rounded-[5px] text-white duration-100 enabled:active:translate-y-5"
				>
					Sign In With Google
				</button>
			</div>
		</div>
	);
}

export default Login;

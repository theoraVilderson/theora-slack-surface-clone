import "./Login.css";
import logo from "../../assets/logo.svg";

function Login() {
	return (
		<div className="Login flex justify-center items-center bg-gray-100 min-h-screen">
			<div className=" text-center p-5 box flex justify-center items-center gap-7 flex-col container shadow max-w-[500px] w-full md:w-1/2 bg-white h-full max-h-[400px]">
				<img src={logo} alt="logo" className="w-24 h-24" />
				<div>
					<h2 className="text-3xl font-black p-2">
						Sign in To Slack With Google
					</h2>
					<h5>{window.location.origin}</h5>
				</div>
				<button className="btn p-2 bg-green-500 rounded-[5px] text-white">
					Sign In With Google
				</button>
			</div>
		</div>
	);
}

export default Login;

import "./Header.css";
import Avatar from "@mui/material/Avatar";
import { useGlobalContext } from "../context/globalContext";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SearchIcon from "@mui/icons-material/Search";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
function Header() {
	const [{ user }] = useGlobalContext();
	return (
		<header className="flex flex-col gap-5 md:flex-row justify-between items-center p-2">
			<div className="flex gap-5 w-full md:w-auto justify-between md:justify-center items-center">
				<Avatar src={user?.userImage} alt="user Avatar" />
				<AccessTimeIcon />
			</div>
			<div className="relative flex items-center">
				<SearchIcon
					className="absolute w-3 h-3 mx-2 cursor-pointer"
					sx={{ width: 20, height: 20 }}
				/>
				<input
					type="search"
					className="bg-transparent min-w-[350px] h-10 outline-0 w-full max-w-[500px] pl-12 pr-2 rounded-[2px]"
					placeholder="Search Theora Vilderson"
				/>
			</div>

			<HelpOutlineOutlinedIcon />
		</header>
	);
}
export default Header;

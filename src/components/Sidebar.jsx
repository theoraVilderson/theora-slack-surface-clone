import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import CreateIcon from "@mui/icons-material/Create";
import InsertCommentIcon from "@mui/icons-material/InsertComment";
import InboxIcon from "@mui/icons-material/Inbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AppsIcon from "@mui/icons-material/Apps";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";

import { useGlobalContext } from "../context/globalContext";
import Avatar from "@mui/material/Avatar";
import "./Sidebar.css";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { actions, serverTimestamp } from "../data/db";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
	status: {
		danger: "#e53e3e",
	},
	palette: {
		primary: {
			main: "#eee",
			darker: "#ddd",
		},
		neutral: {
			main: "#64748B",
			contrastText: "#fff",
		},
	},
});
export function SidebarItem({ title, Icon, roomId, children, ...props }) {
	//  a thing that has icon means that are not channel!
	const isChannel = !!roomId;
	let navigate = useNavigate();
	const onChannelClick = (e) => {
		navigate(`/room/${roomId}`);
	};
	const onChannelDeleteClick = (e) => {
		e.stopPropagation();
		if (!window.confirm(`Are you sure you want to delete "${title}" `))
			return 1;
		// if current roomId is we are on then change the url
		actions.removeChannel(roomId);
		window.location.href.includes(roomId) && navigate("/");
	};
	const onChannelRenameClick = (e) => {
		e.stopPropagation();
		const newName = prompt(
			`you wanna rename to "${title}" to what? `,
			title
		);
		if (newName == null) return 1;
		if (!newName.trim())
			return alert("you can't change name to empty name");

		actions.storeChannel({ name: newName.slice(0, 30) }, roomId);
	};
	return (
		<ThemeProvider theme={theme}>
			<Button
				{...props}
				{...(!isChannel ? null : { onClick: onChannelClick })}
				variant="text"
				className="flex w-full group bg-transparent !justify-start gap-5 p-2 cursor-pointer !not-italic !normal-case"
			>
				<div className="w-4">
					{Icon ? <Icon sx={{ width: 20, height: 20 }} /> : "#"}
				</div>
				<h3>{title}</h3>
				{!isChannel ? null : (
					<div className="flex-1 md:hidden md:group-hover:flex flex justify-end">
						<DriveFileRenameOutlineIcon
							onClick={onChannelRenameClick}
						/>

						<CloseIcon
							onClick={onChannelDeleteClick}
							sx={{ color: "red" }}
						/>
					</div>
				)}
			</Button>
		</ThemeProvider>
	);
}

function Sidebar() {
	const [{ user }] = useGlobalContext();
	const [channels, setChannels] = useState([]);

	const addChannel = () => {
		let channelName = prompt("Please write out Room Name?");
		if (channelName == null) return;
		if (!channelName.trim()) return alert("channel name couldn't be empty");
		channelName = channelName.trim();
		actions.storeChannel({
			name: channelName,
			timestamp: serverTimestamp(),
		});
	};

	useEffect(() => {
		const unsub = actions.channelsListener((sub, data) => {
			setChannels(data.docs.map((e) => ({ id: e.id, ...e.data() })));
		});
		return unsub;
	}, []);
	return (
		<aside className="sidebar w-full md:w-1/3 md:max-w-[300px]  flex flex-col ">
			<div className="flex justify-between items-center p-2 border-b border-solid border-[rgba(255,255,255,.2)]">
				<div>
					<h2> Slack Surface Clone </h2>
					<div className="flex items-center ">
						<FiberManualRecordIcon sx={{ color: "green" }} />{" "}
						<h5 className="text-xs font-thin  ">
							{user?.userName ?? "Guest"}
						</h5>
					</div>
				</div>
				<Avatar
					className="cursor-pointer"
					sx={{ bgcolor: "var(--text-bold)", color: "var(--bg)" }}
				>
					<CreateIcon />
				</Avatar>
			</div>

			<div className="sticky top-0 pt-3 overflow-y-auto sidebar__items">
				<SidebarItem title="Threads" Icon={InsertCommentIcon} />
				<SidebarItem title="Mentions and reactions" Icon={InboxIcon} />
				<SidebarItem title="Saved Items" Icon={DraftsIcon} />
				<SidebarItem
					title="Channel Browser"
					Icon={BookmarkBorderIcon}
				/>
				<SidebarItem
					title="People & User Groups"
					Icon={PeopleAltIcon}
				/>
				<SidebarItem title="Apps" Icon={AppsIcon} />
				<SidebarItem title="File Browser" Icon={FileCopyIcon} />
				<SidebarItem
					title="Show Less"
					style={{
						padding: "10px",
						borderBottom: "solid 1px rgba(255,255,255,.5)",
					}}
					Icon={ExpandLessIcon}
				/>
				<SidebarItem
					title="Channels"
					style={{
						padding: "10px",
						borderBottom: "solid 1px rgba(255,255,255,.5)",
					}}
					Icon={ExpandMoreIcon}
				/>
				<SidebarItem
					title="Add Channels"
					Icon={AddIcon}
					onClick={addChannel}
				/>
				{/* all Channels*/}
				{channels.map((e) => {
					return (
						<SidebarItem
							title={e.name}
							key={e.id}
							roomId={e.id}
							data-roomid={e.id}
						/>
					);
				})}
			</div>
		</aside>
	);
}
export default Sidebar;

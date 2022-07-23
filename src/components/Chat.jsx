import "./Chat.css";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { actions, serverTimestamp } from "../data/db";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { useGlobalContext } from "../context/globalContext";
export function ChatItem({
	userName,
	roomId,
	messageId,
	userSide,
	userImage,
	text,
	date,
}) {
	const [editText, setEditText] = useState("");

	const [openEdit, setOpenEdit] = useState(false);
	const onMessageEditClick = async (e) => {
		if (editText == null) return handleEditClose();
		if (!editText.trim()) {
			handleEditClose();
			alert("you can't change name to empty text");
			return;
		}
		if (!userSide) {
			handleEditClose();
			alert("this message isn't yours");
			return;
		}
		handleEditClose();
		await actions.storeMessage(roomId, { message: editText }, messageId);
	};
	const onMessageDeleteClick = (e) => {
		e.stopPropagation();
		if (!window.confirm(`Are you sure you want to delete "${text}" `))
			return 1;
		// if current roomId is we are on then change the url
		actions.removeMessage(roomId, messageId);
	};

	const handleEditClickOpen = () => {
		setEditText(text);
		setOpenEdit(true);
	};

	const handleEditClose = () => {
		setOpenEdit(false);
		setEditText("");
	};
	const onHitEnter = (e) => {
		e.key === "Enter" && !e.shiftKey && onMessageEditClick(e);
	};
	return (
		<>
			<div
				className={` py-2 group chat__chatItem flex border-b border-[rgba(0,0,0,0.1)] border-solid ${
					userSide ? " justify-start" : ""
				}`}
				dir={userSide ? "ltr" : "rtl"}
			>
				<div className="flex items-center items-center gap-3">
					<Avatar src={userImage} alt={`${userName} profile`} />
					<div className="flex flex-col font-bold justify-center">
						<h4>{userName}</h4>
						<pre
							className="font-thin break-all"
							style={{
								whiteSpace: "pre-wrap" /* Since CSS 2.1 */,
								wordWrap:
									"break-word" /* Internet Explorer 5.5+ */,
							}}
						>
							{text}
						</pre>
						<i className="font-thin text-xs ">{date}</i>
					</div>
				</div>
				{userSide && (
					<div className="items-center flex-1 flex">
						<div className="flex-1 md:hidden items-center md:group-hover:flex flex justify-end">
							<DriveFileRenameOutlineIcon
								className="cursor-pointer"
								onClick={handleEditClickOpen}
							/>

							<CloseIcon
								className="cursor-pointer"
								onClick={onMessageDeleteClick}
								sx={{ color: "red" }}
							/>
						</div>
					</div>
				)}
			</div>
			<Dialog open={openEdit} onClose={handleEditClose}>
				<DialogTitle>Subscribe</DialogTitle>
				<DialogContent>
					<DialogContentText>
						To subscribe to this website, please enter your email
						address here. We will send updates occasionally.
					</DialogContentText>
					<TextField
						value={editText}
						onChange={(e) => setEditText(e.target.value)}
						autoFocus
						margin="dense"
						id="name"
						label="Edit Text"
						type="Text"
						fullWidth
						variant="standard"
						multiline
						onKeyPress={onHitEnter}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleEditClose}>Cancel</Button>
					<Button onClick={onMessageEditClick}>Update</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

function Chat() {
	const { roomId } = useParams();
	const [{ user }] = useGlobalContext();
	const inputRef = useRef();

	const [roomInfo, setRoomInfo] = useState(null);
	const [messages, setMessages] = useState([]);

	const [submitMessage, setSubmitMessage] = useState("");

	const [onsending, setOnsending] = useState(false);
	const onMessageSubmit = async (e) => {
		e.preventDefault();

		if (!submitMessage.trim()) return 1;

		setOnsending(true);

		await actions.storeMessage(roomId, {
			timestamp: serverTimestamp(),
			userName: user.userName,
			userImage: user.userImage,
			message: submitMessage.slice(0, 500),
			userId: user.id,
		});

		setSubmitMessage("");
		setOnsending(false);
		setTimeout(() => {
			inputRef.current.focus();
			document.documentElement.scrollTo(
				0,
				document.documentElement.scrollHeight
			);
		}, 100);
	};
	const onHitEnter = (e) => {
		e.key === "Enter" &&
			!e.shiftKey &&
			(onMessageSubmit(e) || e.preventDefault());
	};
	useEffect(() => {
		const unsub = actions.channelListener(roomId, function (unsub, data) {
			setRoomInfo(data.data());
		});
		return unsub;
	}, [roomId]);
	useEffect(() => {
		const unsub = actions.messageListener(roomId, function (unsub, data) {
			if (messages.length !== data.docs.length) {
				setTimeout(() => {
					if (
						document.documentElement.scrollHeight - 350 <
						window.pageYOffset + window.innerHeight
					)
						document.documentElement.scrollTo(
							0,
							document.documentElement.scrollHeight
						);
				}, 100);
			}
			setMessages(
				data.docs.map((e) => {
					return { id: e.id, ...e.data() };
				})
			);
		});
		return unsub;
	}, [roomId]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		roomInfo && (
			<div className="chat flex-1 p-2 relative flex flex-col ">
				<div className="chat__head flex justify-between items-center font-bold h-16 border-b border-solid border-[rgba(0,0,0,0.5)]">
					<div className="chat__headLeft">
						#{roomInfo?.name} <StarBorderOutlinedIcon />
					</div>
					<div className="chat__headRight">
						<InfoOutlinedIcon /> Details
					</div>
				</div>
				<div className="chat__body box-border flex-1 pb-[70px]">
					<div className="p-5 box-border  min-h-[100%] max-h-[100%] flex-col gap-5 -z-10">
						{messages.map(
							({
								userName,
								userImage,
								userId,
								message,
								timestamp,
								id,
							}) => {
								return (
									<ChatItem
										userName={userName}
										userImage={userImage}
										userSide={userId === user.id}
										text={message}
										roomId={roomId}
										date={
											timestamp
												?.toDate()
												?.toLocaleString() ?? ""
										}
										key={id}
										messageId={id}
									/>
								);
							}
						)}
					</div>
					<div className="sticky bottom-[10px] w-full flex justify-center bg-white">
						<div className="w-[85%] md:w-[95%] ">
							<form
								className="flex items-center justify-center gap-4 "
								action=""
								onSubmit={onMessageSubmit}
							>
								<TextField
									autoFocus
									inputRef={inputRef}
									fullWidth
									id="filled-error"
									label="Write Some Message"
									size="small"
									onChange={(e) =>
										setSubmitMessage(e.target.value)
									}
									variant="filled"
									disabled={onsending}
									value={submitMessage}
									onKeyPress={onHitEnter}
									multiline
								/>
								<Button
									type="submit"
									variant="contained"
									color="success"
									disabled={onsending}
								>
									<SendIcon />
								</Button>
							</form>
						</div>
					</div>
				</div>
			</div>
		)
	);
}

export default Chat;

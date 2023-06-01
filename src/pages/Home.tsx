import {
	Box,
	Button,
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	Link,
	Stack,
	Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";

import { joinRoom } from "trystero";

// const queryParams = new URLSearchParams(window.location.search);
// const roomID = queryParams.get("roomID") ?? undefined;

// const sendMessage = roomID
// 	? joinRoom({ appId: "Curio-Joystick" }, roomID).makeAction("message")[0]
// 	: undefined;
// // console.log(sendMessage, roomID, queryParams);

export default function Home() {
	const { roomID } = useParams();

	return (
		<Stack
			direction="column"
			justifyContent="center"
			alignItems="center"
			height="100vh"
		>
			<Stack
				bgcolor="rgba(33, 158, 188, 0.4)"
				justifyContent="center"
				alignItems="center"
				height="50vh"
			>
				<Button
					href={`controller/${roomID ?? ""}`}
					size="large"
					variant="contained"
					sx={{ m: 2 }}
				>
					Controller
				</Button>
				<Typography
					textAlign="center"
					variant="h6"
					sx={{ m: 2, mt: 0 }}
				>
					If you are going to use this device as the controller,
					select this option. RoomID : {roomID}
				</Typography>
			</Stack>
			<Stack
				bgcolor="rgba(251, 133, 0, 0.4)"
				justifyContent="center"
				alignItems="center"
				height="50vh"
			>
				<Button
					href={`host/${roomID ?? ""}`}
					size="large"
					variant="contained"
					sx={{ m: 2 }}
				>
					Host
				</Button>
				<Typography
					textAlign="center"
					variant="h6"
					sx={{ m: 2, mt: 0 }}
				>
					If this device will be on Curio, select this option. RoomID
					: {roomID}
				</Typography>
			</Stack>
		</Stack>
	);
}

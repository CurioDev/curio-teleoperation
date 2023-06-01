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

export default function HostRoom() {
	const { roomID } = useParams();
	return (
		<Stack
			direction="column"
			justifyContent="center"
			alignItems="center"
			height="100vh"
		>
			This is the Host page. RoomID: {roomID}
		</Stack>
	);
}

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
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QRCode from "qrcode";
// import { joinRoom } from "trystero";
import { PeerData } from "../services/types";
import { processReceivedData } from "../services/peerService";
import Peer, { DataConnection } from "peerjs";

export default function Host() {
	const { roomID } = useParams();
	const [useExternalHost, setUseExternalHost] = useState<boolean>(false);
	const [qrCode, setQrCode] = useState<string | undefined>(undefined);
	const [isPeerConnected, setIsPeerConnected] = useState<boolean>(false);

	useEffect(() => {
		let finalRoomID = roomID;
		if (finalRoomID) {
			setUseExternalHost(true);
		} else {
			finalRoomID = `curio-joystick-controller-${Date.now()}`;
		}

		const peer = new Peer(finalRoomID);
		peer.on("open", () => {
			const url = `http://localhost:3000/controller/${finalRoomID}`;

			console.log(url);
			QRCode.toDataURL(
				url,
				{
					width: 500,
					margin: 1,
				},
				(err, url) => {
					if (err) {
						console.error(err);
					} else {
						setQrCode(url);
					}
				}
			);
		});

		peer.on("connection", (connection) => {
			console.log(connection);

			connection.on("data", (data) => {
				processReceivedData(data as PeerData);
			});
		});

		// const room = joinRoom({ appId: "Curio-Joystick" }, finalRoomID);
		// room.onPeerJoin((peerID) => {
		// 	console.log(peerID);
		// 	setQrCode(undefined);
		// 	setIsPeerConnected(true);
		// });

		// const addStream = async () => {
		// 	const selfStream = await navigator.mediaDevices.getUserMedia({
		// 		audio: true,
		// 		video: true,
		// 	});

		// 	// send stream to peers currently in the room
		// 	room.addStream(selfStream);
		// };

		// addStream();

		// const getMessage = room.makeAction("message")[1];
		// getMessage((data) => {
		// 	processReceivedData(data as PeerData);
		// });
	}, []);

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

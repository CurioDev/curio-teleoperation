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
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import QRCode from "qrcode";
// import { joinRoom } from "trystero";
import { PeerData } from "../services/types";
import { processReceivedData } from "../services/peerService";
import Peer, { DataConnection } from "peerjs";

export default function Host() {
	const { roomID } = useParams();
	const [otherPeerID, setOtherPeerID] = useState<string>("");
	const [useExternalHost, setUseExternalHost] = useState<boolean>(false);
	const [qrCode, setQrCode] = useState<string | undefined>(undefined);
	const [isPeerConnected, setIsPeerConnected] = useState<boolean>(false);
	const [isCallStarted, setIsCallStarted] = useState<boolean>(false);
	const currentUserVideoRef = useRef<HTMLVideoElement>(null);

	const peerInstance = useRef<Peer | null>(null);

	useEffect(() => {
		let finalRoomID = roomID;
		if (finalRoomID) {
			setUseExternalHost(true);
		} else {
			finalRoomID = `curio-joystick-controller-${Date.now()}`;
		}

		const peer = new Peer(finalRoomID);
		peer.on("open", () => {
			const url = `https://curio-teleoperation.vercel.app/controller/${finalRoomID}`;
			// const url = `http://localhost:3000/controller/${finalRoomID}`;

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
			console.log(connection.peer);
			setOtherPeerID(connection.peer);
			setIsPeerConnected(true);
			setQrCode(undefined);

			connection.on("data", (data) => {
				processReceivedData(data as PeerData);
			});
		});

		peerInstance.current = peer;

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

	const startVideo = () => {
		const callPeer = async () => {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: false,
				video: { facingMode: "environment" },
			});
			if (peerInstance.current) {
				const call = peerInstance.current.call(otherPeerID, stream);
				setIsCallStarted(true);
			}

			if (currentUserVideoRef.current) {
				currentUserVideoRef.current.srcObject = stream;
				currentUserVideoRef.current.play();
			}
		};
		callPeer();
	};

	return (
		<Stack
			direction="column"
			justifyContent="center"
			alignItems="center"
			height="100vh"
		>
			{qrCode && (
				<>
					<Typography>
						Scan the QR code on the Controller device.
					</Typography>
					<img alt="QR Code" src={qrCode} width="100%" />
				</>
			)}
			{isPeerConnected && (
				<>
					{!isCallStarted && (
						<Button onClick={startVideo} variant="contained">
							START VIDEO
						</Button>
					)}
					<div>
						<video
							ref={currentUserVideoRef}
							height="50%"
							autoPlay
							loop
							muted
							playsInline
						/>
					</div>
					This is the Host device.
				</>
			)}
		</Stack>
	);
}

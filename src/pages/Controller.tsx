import { Button, Stack } from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Joystick } from "react-joystick-component";
import { Curio } from "../services/curioServices";
import { DataType, PeerData } from "../services/types";
import Peer, { DataConnection } from "peerjs";

export default function Controller() {
	const curio = new Curio();
	const { roomID } = useParams();
	const peer = new Peer(); // Create PeerJS instance

	peer.on("call", (call) => {
		console.log("call");

		call.answer();
		call.on("stream", function (remoteStream) {
			console.log(remoteStream);

			if (remoteVideoRef.current) {
				remoteVideoRef.current.srcObject = remoteStream;
				remoteVideoRef.current.play();
			}
		});
	});
	const [connection, setConnection] = useState<DataConnection>(); // Store the connection
	const [isPeerConnected, setIsPeerConnected] = useState<boolean>(false);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [isMoving, setIsMoving] = useState<boolean>(false);

	const remoteVideoRef = useRef<HTMLVideoElement>(null);

	const peerConnection = () => {
		if (roomID) {
			console.log(roomID);

			const conn = peer.connect(roomID);
			setConnection(conn);
			console.log(conn);
			setIsPeerConnected(true);
		}
	};

	const sendMessage = (data: PeerData) => {
		if (connection) {
			console.log(data);

			connection.send(data); // Send the message to the receiver
		}
	};

	const handleConnect = () => {
		const connectData: PeerData = {
			type: DataType.CURIO_CONNECT,
			data: { isConnected: isConnected },
		};
		sendMessage(connectData);
		setIsConnected(!isConnected);
	};

	const handleMove = (x: number, y: number, distance: number) => {
		const moveData: PeerData = {
			type: DataType.CURIO_MOVE_VECTOR,
			data: { x: x, y: y, speed: distance },
		};
		sendMessage(moveData);

		if (!isMoving) {
			const moveCommand: PeerData = {
				type: DataType.CURIO_MOVE,
				data: { message: "move" },
			};
			sendMessage(moveCommand);
		}

		setIsMoving(true);
	};

	const handleStart = () => {
		//setIsMoving(true);
	};

	const handleStop = () => {
		setIsMoving(false);

		const moveData: PeerData = {
			type: DataType.CURIO_MOVE_VECTOR,
			data: { x: 0, y: 0, speed: 0 },
		};
		sendMessage(moveData);
	};

	useEffect(() => {
		let intervalId: NodeJS.Timer;

		if (isMoving) {
			const moveCommand: PeerData = {
				type: DataType.CURIO_MOVE,
				data: { message: "move" },
			};
			sendMessage(moveCommand);
			intervalId = setInterval(() => {
				const moveCommand: PeerData = {
					type: DataType.CURIO_MOVE,
					data: { message: "move" },
				};

				sendMessage(moveCommand);
			}, 1000);
		}

		return () => {
			clearInterval(intervalId);
			if (isConnected) {
				const stopCommand: PeerData = {
					type: DataType.CURIO_MOVE,
					data: { message: "stop" },
				};
				sendMessage(stopCommand);
			}
		};
	}, [isMoving]);

	return (
		<Stack direction="column" justifyContent="center" alignItems="center">
			{isPeerConnected ? (
				<>
					<div>
						<video
							ref={remoteVideoRef}
							height="50%"
							autoPlay
							loop
							muted
							playsInline
						/>
					</div>
					<Button
						onClick={() => {
							handleConnect();
						}}
						style={
							isConnected
								? {
										backgroundColor:
											"rgba(171, 61, 89, 255)",
								  }
								: {
										backgroundColor:
											"rgba(61, 89, 171, 255)",
								  }
						}
						sx={{ mb: 10, mt: 2 }}
						variant="contained"
					>
						{isConnected ? "DISCONNECT" : "CONNECT TO CURIO"}
					</Button>
					{isConnected && (
						<Joystick
							move={(e) => {
								handleMove(e.x ?? 0, e.y ?? 0, e.distance ?? 0);
							}}
							start={() => {
								handleStart();
							}}
							stop={() => {
								handleStop();
							}}
							throttle={10}
						/>
					)}
				</>
			) : (
				<Button
					onClick={() => {
						peerConnection();
					}}
					style={{
						backgroundColor: "green",
					}}
					sx={{ mt: 10 }}
					variant="contained"
				>
					CONNECT TO THE HOST DEVICE
				</Button>
			)}
		</Stack>
	);

	// return (
	// 	<Stack
	// 		direction="column"
	// 		justifyContent="center"
	// 		alignItems="center"
	// 		height="100vh"
	// 	>
	// 		This is the Controller page. RoomID: {roomID}
	// 	</Stack>
	// );
}

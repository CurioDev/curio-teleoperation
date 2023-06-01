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
	let connection: DataConnection | null = null; // Store the connection

	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [isMoving, setIsMoving] = useState<boolean>(false);

	useEffect(() => {
		if (roomID) {
			console.log(roomID);

			connection = peer.connect(roomID);
			console.log(connection);
		}

		return () => {
			connection?.close();
			peer.disconnect(); // Disconnect from the PeerJS server
		};
	}, []);

	const sendMessage = (data: PeerData) => {
		if (connection) {
			connection.send(data); // Send the message to the receiver
		}
	};

	const handleConnect = () => {
		if (sendMessage) {
			const connectData: PeerData = {
				type: DataType.CURIO_CONNECT,
				data: { isConnected: isConnected },
			};
			sendMessage(connectData);
			setIsConnected(!isConnected);
		} else {
			if (!isConnected) {
				curio.connect(() => {
					console.log("Connected");
					setIsConnected(true);
				});
			} else {
				curio.disconnect(() => {
					console.log("Disconnected");
					setIsConnected(false);
				});
			}
		}
	};

	const handleMove = (x: number, y: number, distance: number) => {
		if (sendMessage) {
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
		} else {
			curio.setParameters(x, y, distance);
			if (!isMoving) {
				curio.move();
			}
		}

		setIsMoving(true);
	};

	const handleStart = () => {
		//setIsMoving(true);
	};

	const handleStop = () => {
		setIsMoving(false);

		if (sendMessage) {
			const moveData: PeerData = {
				type: DataType.CURIO_MOVE_VECTOR,
				data: { x: 0, y: 0, speed: 0 },
			};
			sendMessage(moveData);
		} else {
			curio.setParameters(0, 0, 0);
		}
	};

	useEffect(() => {
		let intervalId: NodeJS.Timer;

		if (isMoving) {
			if (sendMessage) {
				const moveCommand: PeerData = {
					type: DataType.CURIO_MOVE,
					data: { message: "move" },
				};
				sendMessage(moveCommand);
			} else {
				curio.move();
			}
			intervalId = setInterval(() => {
				if (sendMessage) {
					const moveCommand: PeerData = {
						type: DataType.CURIO_MOVE,
						data: { message: "move" },
					};
					sendMessage(moveCommand);
				} else {
					curio.move();
				}
			}, 1000);
		}

		return () => {
			clearInterval(intervalId);
			if (isConnected) {
				if (sendMessage) {
					const stopCommand: PeerData = {
						type: DataType.CURIO_MOVE,
						data: { message: "stop" },
					};
					sendMessage(stopCommand);
				} else {
					curio.stop();
				}
			}
		};
	}, [isMoving]);

	return (
		<Stack
			direction="column"
			justifyContent="center"
			alignItems="center"
			spacing={20}
		>
			<Button
				onClick={() => {
					handleConnect();
				}}
				style={
					isConnected
						? {
								backgroundColor: "rgba(171, 61, 89, 255)",
						  }
						: {
								backgroundColor: "rgba(61, 89, 171, 255)",
						  }
				}
				sx={{ mt: 10 }}
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

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Controller from "./pages/Controller";
import Host from "./pages/Host";
import HostRoom from "./pages/HostRoom";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/:roomID" element={<Home />} />
				<Route path="controller/:roomID" element={<Controller />} />
				<Route path="host/" element={<Host />} />
				<Route path="host/:roomID" element={<Host />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;

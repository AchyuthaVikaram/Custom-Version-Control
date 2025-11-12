import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import { useAuth } from "./authContext";
import ModernDashboard from "./components/dashboard/ModernDashboard";
import ModernProfile from "./components/user/ModernProfile";
import AllRepositories from "./components/repo/AllRepositories";
import NewRepo from "./components/repo/NewRepo";
import ModernRepoDetail from "./components/repo/ModernRepoDetail";
import VersionControl from "./components/vcs/VersionControl";

function AuthHandler() {
	const { currUser, setCurrUser } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		const userIdFromStorage = localStorage.getItem("userId");
		if (userIdFromStorage && !currUser) {
			setCurrUser(userIdFromStorage);
		}
		if (
			!userIdFromStorage &&
			!["/auth", "/signup"].includes(window.location.pathname)
		) {
			navigate("/auth");
		}
		if (userIdFromStorage && window.location.pathname === "/auth") {
			navigate("/"); // Redirect to dashboard
		}
	}, [currUser, setCurrUser, navigate]);

	return null; // No UI component, only authentication logic
}

function App() {
	return (
		<BrowserRouter>
			<AuthHandler />
			<Routes>
				<Route path="/" element={<ModernDashboard />} />
				<Route path="/auth" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/profile" element={<ModernProfile />} />
				<Route path="/user/repositories" element={<AllRepositories />} />
				<Route path="/repo/new" element={<NewRepo />} />
				<Route path="/repo/:id" element={<ModernRepoDetail />} />
				<Route path="/vcs/:repoId" element={<VersionControl />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;

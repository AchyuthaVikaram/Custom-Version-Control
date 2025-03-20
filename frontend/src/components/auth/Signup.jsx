import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import { Heading } from "@primer/react";
import { Box, Button } from "@primer/react";
import "./auth.css";

import logo from "../../assets/github-mark-white.svg";
import { Link } from "react-router-dom";
import BASE_URL from "../../constant";

const Signup = () => {
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const { setCurrUser } = useAuth();

	const handleSignup = async (e) => {
		e.preventDefault();

		try {
			setLoading(true);
			const res = await axios.post(`${BASE_URL}/signup`, {
				email: email,
				password: password,
				username: username,
			});

			console.log(res);
			localStorage.setItem("token", res.data.token);
			localStorage.setItem("userId", res.data.userId);

			setCurrUser(res.data.userId);
			setLoading(false);

			window.location.href = "/";
		} catch (err) {
			console.error(err);
			alert(`${err?.response?.data?.message}`);
			setLoading(false);
		}
	};

	return (
		<div className="login-wrapper">
			<div className="login-logo-container">
				<img className="logo-login" src={logo} alt="Logo" />
			</div>

			<div className="login-box-wrapper">
				<div className="login-heading">
					<Box sx={{ padding: 1 }}>
						<Heading as="h6">Signup</Heading>
					</Box>
				</div>

				<div className="login-box">
					<div>
						<label className="label">Username</label>
						<input
							autoComplete="off"
							name="Username"
							id="Username"
							className="input"
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>

					<div>
						<label className="label">Email address</label>
						<input
							autoComplete="off"
							name="Email"
							id="Email"
							className="input"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>

					<div className="div">
						<label className="label">Password</label>
						<input
							autoComplete="off"
							name="Password"
							id="Password"
							className="input"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>

					<Button
						variant="primary"
						className="login-btn"
						disabled={loading}
						onClick={handleSignup}
					>
						{loading ? "Loading..." : "Signup"}
					</Button>
				</div>

				<div className="pass-box">
					<p>
						Already have an account? <Link to="/auth">Login</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Signup;

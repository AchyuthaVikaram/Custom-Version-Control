import React, { useState, useEffect } from "react";

import { Heading } from "@primer/react";
import { Box, Button } from "@primer/react";
import "./auth.css";

import logo from "../../assets/github-mark-white.svg";
import { Link } from "react-router-dom";
import { useAuth } from "../../authContext";
import BASE_URL from "../../constant";
import axios from "axios";

const Login = () => {
	useEffect(() => {
		if (localStorage.getItem("userId")) window.location.href = "/";
	}, []);

	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { setCurrUser } = useAuth();

	const handleLogin = async (e) => {
		e.preventDefault();

		try {
			setLoading(true);
			const res = await axios.post(`${BASE_URL}/login`, {
				email: email,
				password: password,
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
						<Heading as="h6">Login</Heading>
					</Box>
				</div>
				<div className="login-box">
					<div>
						<label className="label">Email address</label>
						<input
							autoComplete="off"
							name="email"
							id="Email"
							className="input"
							type="email"
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
							}}
						/>
					</div>
					<div className="div">
						<label className="label">Password</label>
						<input
							autoComplete="off"
							name="password"
							id="Password"
							className="input"
							type="password"
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
							}}
						/>
					</div>

					<Button
						variant="primary"
						className="login-btn"
						disabled={loading}
						onClick={handleLogin}
					>
						{loading ? "Loading..." : "Login"}
					</Button>
				</div>
				<div className="pass-box">
					<p>
						New to GitHub? <Link to="/signup">Create an account</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;

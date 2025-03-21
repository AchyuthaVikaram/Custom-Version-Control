import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";
import { UnderlineNav } from "@primer/react";
import { BookIcon, RepoIcon } from "@primer/octicons-react";
import { useAuth } from "../../authContext";
import BASE_URL from "../../constant";
import Navbar from "./Navbar";
import HeatMapProfile from "./HeatMap";

const Profile = () => {
	const navigate = useNavigate();
	const [userDetails, setUserDetails] = useState({});
	const { setCurrUser } = useAuth();

	useEffect(() => {
		const fetchUserDetails = async () => {
			const userId = localStorage.getItem("userId");
			console.log(userId);

			if (userId) {
				try {
					const response = await axios.get(`${BASE_URL}/userProfile/${userId}`);
					setUserDetails(response.data.user);
				} catch (err) {
					console.error(err);
					alert(`${err?.response?.data?.message}`);
					setLoading(false);
				}
			}
		};
		fetchUserDetails();
	}, []);

	return (
		<>
			<Navbar />
			<UnderlineNav aria-label="Repository">
				<UnderlineNav.Item
					aria-current="page"
					icon={BookIcon}
					sx={{
						backgroundColor: "transparent",
						color: "white",
						"&:hover": {
							textDecoration: "underline",
							color: "white",
						},
					}}
				>
					Overview
				</UnderlineNav.Item>

				<UnderlineNav.Item
					onClick={() => navigate("/repo")}
					icon={RepoIcon}
					sx={{
						backgroundColor: "transparent",
						color: "whitesmoke",
						"&:hover": {
							textDecoration: "underline",
							color: "white",
						},
					}}
				>
					Starred Repositories
				</UnderlineNav.Item>
			</UnderlineNav>

			<button
				onClick={() => {
					localStorage.removeItem("token");
					localStorage.removeItem("userId");
					setCurrUser(null);

					window.location.href = "/auth";
				}}
				style={{ position: "fixed", bottom: "50px", right: "50px" }}
				id="logout"
			>
				Logout
			</button>

			<div className="profile-page-wrapper">
				<div className="user-profile-section">
					<div className="profile-image"></div>

					<div className="name">
						<h3>{userDetails.username}</h3>
					</div>

					<button className="follow-btn">Follow</button>

					<div className="follower">
						<p>10 Follower</p>
						<p>3 Following</p>
					</div>
				</div>

				<div className="heat-map-section">
					<HeatMapProfile />
				</div>
			</div>
		</>
	);
};

export default Profile;

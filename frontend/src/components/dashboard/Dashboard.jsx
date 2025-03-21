import axios from "axios";
import React, { useState, useEffect } from "react";
import BASE_URL from "../../constant";
import "./dashboard.css";
import Navbar from "../user/Navbar";
import { FaFolder } from "react-icons/fa"; // File icon
import { FaUserCircle } from "react-icons/fa"; // User avatar icon

export default function Dashboard() {
	const [repositories, setRepositories] = useState([]);
	const [suggestedRepositories, setSuggestedRepositories] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchQuery2, setSearchQuery2] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [searchResults2, setSearchResults2] = useState([]);
	const [showDropdown, setShowDropdown] = useState(false);

	useEffect(() => {
		const userId = localStorage.getItem("userId");
		const fetchReposOfUser = async () => {
			try {
				const res = await axios.get(`${BASE_URL}/repo/user/${userId}`);
				console.log(res.data);
				setRepositories(res.data.repos);
			} catch (error) {
				console.log(error);
				alert(`${error?.response?.data?.message}`);
			}
		};
		fetchReposOfUser();
		const fetchAllRepos = async () => {
			try {
				const res = await axios.get(`${BASE_URL}/repo/all`);
				console.log(res.data);
				setSuggestedRepositories(res.data.repos);
			} catch (error) {
				console.log(error);
				alert(`${error?.response?.data?.message}`);
			}
		};
		fetchAllRepos();
	}, []);

	useEffect(() => {
		if (searchQuery == "") {
			setSearchResults(suggestedRepositories);
		} else {
			const filteredResults = suggestedRepositories.filter(
				(repo) =>
					repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					repo.description.toLowerCase().includes(searchQuery.toLowerCase())
			);
			setSearchResults(filteredResults);
		}
	}, [searchQuery, suggestedRepositories]);

	useEffect(() => {
		if (searchQuery2 == "") {
			setSearchResults2(repositories);
		} else {
			const filteredResults = repositories.filter(
				(repo) =>
					repo.name.toLowerCase().includes(searchQuery2.toLowerCase()) ||
					repo.description.toLowerCase().includes(searchQuery2.toLowerCase())
			);
			setSearchResults2(filteredResults);
		}
	}, [searchQuery2, repositories]);

	return (
		<>
			<Navbar />
			<section id="dashboard">
				{/* Suggested Repositories Section */}
				<aside className="suggested-repos">
					{/* Avatar & Username */}
					<div
						className="profile-section"
						onClick={() => setShowDropdown(!showDropdown)}
					>
						<FaUserCircle className="avatar-icon" />
						<h3>username</h3>
					</div>
					{showDropdown && (
						<div className="profile-dropdown">
							<a href="/profile">Profile</a>
							<a href="/your-repositories">Your Repositories</a>
						</div>
					)}

					{/* Recent Title */}
					<h4>Recent Repositories</h4>

					{/* Search Box */}
					<input
						type="text"
						value={searchQuery2}
						placeholder="Search Repositories..."
						onChange={(e) => setSearchQuery2(e.target.value)}
						className="search-box"
					/>

					{/* Suggested Repositories List */}
					<div className="repo-list">
						{searchResults2.map((repo) => (
							<div key={repo._id} className="repo-item">
								<FaFolder className="repo-icon" />
								<span
									className="repo-name"
									style={{ color: "white", fontSize: "15px" }}
								>
									<strong style={{ color: "white" }}>
										{repo.owner.username}
									</strong>
									/{repo.name}
								</span>
							</div>
						))}
					</div>
				</aside>
				<main>
					<h2>Your Repositories</h2>
					<br />
					{/* <div id="search"> */}
					<input
						type="text"
						value={searchQuery}
						placeholder="Search..."
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
					{/* </div> */}
					<br />
					<br />
					{searchResults.map((repo) => {
						return (
							<div key={repo._id} >
								<h4>{repo.name}</h4>
								<h4>{repo.description}</h4>
							</div>
						);
					})}
				</main>
				<aside>
					<h3>Upcoming Events</h3>
					<ul>
						<li>
							<p>Tech Conference - Dec 15</p>
						</li>
						<li>
							<p>Developer Meetup - Dec 25</p>
						</li>
						<li>
							<p>React Summit - Jan 5</p>
						</li>
					</ul>
				</aside>
			</section>
		</>
	);
}

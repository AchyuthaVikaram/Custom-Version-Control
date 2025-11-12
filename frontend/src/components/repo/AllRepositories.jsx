import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	FaEdit,
	FaTrash,
	FaSearch,
	FaPlus,
	FaLock,
	FaGlobe,
} from "react-icons/fa"; // Icons
import BASE_URL from "../../constant";
import api from "../../api";
import Navbar from "../Navbar";
import "./allrepos.css";

export default function AllRepos() {
	const [repositories, setRepositories] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
    const navigate = useNavigate();

	useEffect(() => {
		const fetchReposOfUser = async () => {
			try {
				const userId = localStorage.getItem("userId"); // Get current user ID
				const res = await api.get(`${BASE_URL}/repo/user/${userId}`);
				setRepositories(res.data.repos);
			} catch (err) {
				setError("Failed to load repositories.");
			} finally {
				setLoading(false);
			}
		};

		fetchReposOfUser();
	}, []);

	const handleDelete = async (repoId) => {
		if (!window.confirm("Are you sure you want to delete this repository?"))
			return;

		try {
			await api.delete(`${BASE_URL}/repo/delete/${repoId}`);
			setRepositories(repositories.filter((repo) => repo._id !== repoId));
		} catch (error) {
			console.log(error);
			alert(`${error?.response?.data?.message}`);
		}
	};

	// Filter repositories based on search query
	const filteredRepos = repositories.filter((repo) =>
		repo.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	if (loading) return <div className="loading">Loading repositories...</div>;
	if (error) return <div className="error">{error}</div>;

	return (
		<>
			<Navbar />
			<div className="main-container">
				<h2 className="title">Your Repositories</h2>
				<div className="repos-container">
					<div className="header">
						{/* Search Bar */}
						<div className="search-bar">
							<FaSearch className="search-icon" />
							<input
								type="text"
								placeholder="Search repositories..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>

						{/* Create New Repo Button */}
						<button
							className="create-btn"
							onClick={() => navigate("/repo/new")}
						>
							<FaPlus className="plus-icon" /> New Repo
						</button>
					</div>

					{filteredRepos.length === 0 ? (
						<p className="no-repos">No repositories found.</p>
					) : (
						<div className="repo-list">
							{filteredRepos.map((repo) => (
								<div key={repo._id} className="repo-card" onClick={() => navigate(`/repo/${repo._id}`)} style={{cursor:"pointer"}}>
									<div className="repo-header">
										{/* Repo Name & Visibility Badge */}
										<div className="repo-name-container">
											<h3 className="repo-name">{repo.name}</h3>
											<span
												className={`badge ${
													repo.visibility ? "public-badge" : "private-badge"
												}`}
											>
												{repo.visibility ? (
													<>
														<FaGlobe className="badge-icon" /> Public
													</>
												) : (
													<>
														<FaLock className="badge-icon" /> Private
													</>
												)}
											</span>
										</div>

										{/* Edit & Delete Actions */}
										<div className="repo-actions">
											<FaEdit className="edit-icon" title="Edit" onClick={(e) => { e.stopPropagation(); navigate(`/repo/${repo._id}`); }} />
											<FaTrash
												className="delete-icon"
												title="Delete"
												onClick={(e) => { e.stopPropagation(); handleDelete(repo._id); }}
											/>
										</div>
									</div>

									<p className="repo-owner">@{repo.owner.username}</p>
									<p className="repo-description">
										{repo.description || "No description available."}
									</p>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</>
	);
}

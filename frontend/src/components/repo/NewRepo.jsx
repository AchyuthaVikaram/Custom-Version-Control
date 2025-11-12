import React, { useState } from "react";
import "./newrepo.css";
import { FaLock, FaGlobe, FaPlus } from "react-icons/fa";
import Navbar from "../Navbar";
import BASE_URL from "../../constant";
import api from "../../api";
import { useNavigate } from "react-router-dom";

const NewRepo = () => {
	const [repoName, setRepoName] = useState("");
	const [description, setDescription] = useState("");
	const [visibility, setVisibility] = useState(true); // true = public, false = private
	const navigate = useNavigate();

	const handleCreateRepo = async () => {
		if (!repoName.trim()) {
			alert("Repository name is required!");
			return;
		}
		const newRepoData = {
			name: repoName,
			description,
			visibility,
			userId: localStorage.getItem("userId"),
			content: [],
			issues: [],
		};
		console.log("Creating repo with data:", newRepoData);
		try {
			const res = await api.post(`${BASE_URL}/repo/create`, newRepoData);
			console.log("Repo created successfully:", res.data);
			alert("Repository created successfully!");
			setRepoName("");
			navigate("/");
		} catch (error) {
			console.log(error);
			alert(`${error?.response?.data?.message}`);
		}
	};

	return (
		<>
			<Navbar />
			<div className="main-container">
				<div className="new-repo-container">
					<h2 className="title">Create a new repository</h2>
					<p className="subtitle">
						A repository contains all project files, including the revision
						history.
					</p>

					{/* Owner & Repo Name */}
					<div className="input-group">
						<label>Owner *</label>
						<input
							type="text"
							value="AchyuthaVikaram"
							disabled
							className="disabled-input"
						/>
					</div>

					<div className="input-group">
						<label>Repository name *</label>
						<input
							type="text"
							value={repoName}
							onChange={(e) => setRepoName(e.target.value)}
							placeholder="Enter repository name"
						/>
					</div>

					{/* Description */}
					<div className="input-group">
						<label>Description (optional)</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Write something about your repository..."
						/>
					</div>

					{/* Visibility (Public/Private) */}
					<div className="visibility-section">
						<label>Visibility</label>
						<div className="visibility-options">
							<label
								className={`visibility-option ${visibility ? "selected" : ""}`}
							>
								<input
									type="radio"
									value="true"
									checked={visibility}
									onChange={() => setVisibility(true)}
								/>
								<FaGlobe className="icon" /> Public
							</label>
							<label
								className={`visibility-option ${!visibility ? "selected" : ""}`}
							>
								<input
									type="radio"
									value="false"
									checked={!visibility}
									onChange={() => setVisibility(false)}
								/>
								<FaLock className="icon" /> Private
							</label>
						</div>
					</div>

					{/* Create Repository Button */}
					<button className="create-btn" onClick={handleCreateRepo}>
						<FaPlus className="btn-icon" /> Create Repository
					</button>
				</div>
			</div>
		</>
	);
};

export default NewRepo;

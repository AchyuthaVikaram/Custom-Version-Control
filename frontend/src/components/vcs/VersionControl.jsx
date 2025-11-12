import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar";
import BranchManager from "./BranchManager";
import CommitHistory from "./CommitHistory";
import TagManager from "./TagManager";
import { FaCodeBranch, FaHistory, FaTag } from "react-icons/fa";
import "./vcs.css";

export default function VersionControl() {
	const { repoId } = useParams();
	const [activeTab, setActiveTab] = useState("branches");

	return (
		<>
			<Navbar />
			<div className="version-control-container">
				<div className="vcs-header">
					<h1>Version Control</h1>
					<p>Manage branches, commits, and tags for your repository</p>
				</div>

				<div className="vcs-tabs">
					<button
						className={`tab-button ${activeTab === "branches" ? "active" : ""}`}
						onClick={() => setActiveTab("branches")}
					>
						<FaCodeBranch /> Branches
					</button>
					<button
						className={`tab-button ${activeTab === "commits" ? "active" : ""}`}
						onClick={() => setActiveTab("commits")}
					>
						<FaHistory /> Commits
					</button>
					<button
						className={`tab-button ${activeTab === "tags" ? "active" : ""}`}
						onClick={() => setActiveTab("tags")}
					>
						<FaTag /> Tags
					</button>
				</div>

				<div className="vcs-content">
					{activeTab === "branches" && <BranchManager repoId={repoId} />}
					{activeTab === "commits" && <CommitHistory repoId={repoId} />}
					{activeTab === "tags" && <TagManager repoId={repoId} />}
				</div>
			</div>
		</>
	);
}

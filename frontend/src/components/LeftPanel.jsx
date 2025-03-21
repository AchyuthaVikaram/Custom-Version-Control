import React from "react";
import { Link } from "react-router-dom";
import {
	FaHome,
	FaCodeBranch,
	FaProjectDiagram,
	FaComments,
	FaCode,
	FaRobot,
	FaCompass,
	FaStore,
	FaGithub,
	FaTimes,
} from "react-icons/fa";
import "./leftpanel.css"; // Import the CSS file

const LeftPanel = ({ showLeftPanel, toggleLeftPanel }) => {
	return (
		<div className={`left-panel ${showLeftPanel ? "show" : ""}`}>
			{/* Header with GitHub Icon */}
			<div className="panel-header">
				<FaGithub size={40} />
				<button className="close-btn" onClick={toggleLeftPanel}>
					<FaTimes />
				</button>
			</div>
			<hr className="menu-separator" />
			{/* Menu Options */}
			<ul className="panel-menu" style={{ marginBlock: "30px" }}>
				<li>
					<Link to="/">
						<FaHome /> Home
					</Link>
				</li>
				<li>
					<Link to="/issues">
						<FaCodeBranch /> Issues
					</Link>
				</li>
				<li>
					<Link to="/pull-requests">
						<FaProjectDiagram /> Pull Requests
					</Link>
				</li>
				<li>
					<Link to="/user/repositories">
						<FaProjectDiagram /> Projects
					</Link>
				</li>
				<li>
					<Link to="/discussions">
						<FaComments /> Discussions
					</Link>
				</li>
				<li>
					<Link to="/codespaces">
						<FaCode /> Codespaces
					</Link>
				</li>
				<li>
					<Link to="/copilot">
						<FaRobot /> Copilot
					</Link>
				</li>
			</ul>

			{/* Separator */}
			<hr className="menu-separator" />

			{/* Explore & Marketplace */}
			<ul className="panel-menu" style={{ marginBlock: "30px" }}>
				<li>
					<Link to="/explore">
						<FaCompass /> Explore
					</Link>
				</li>
				<li>
					<Link to="/marketplace">
						<FaStore /> Marketplace
					</Link>
				</li>
			</ul>

			{/* Separator */}
			<hr className="menu-separator" />
		</div>
	);
};

export default LeftPanel;

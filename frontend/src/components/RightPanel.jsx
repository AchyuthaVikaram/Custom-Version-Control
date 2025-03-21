import React from "react";
import { Link } from "react-router-dom";
import { FaUser, FaBook, FaRobot, FaFolder, FaStar, FaCode, FaUsers, FaBuilding, FaHeart, FaTimes, FaSignOutAlt, FaCogs } from "react-icons/fa";
import "./rightpanel.css"; // Import the CSS file

const RightPanel = ({ showRightPanel, toggleRightPanel }) => {
	return (
		<div className={`right-panel ${showRightPanel ? "show" : ""}`}>
			{/* Profile Header */}
			<div className="profile-header">
				<img
					src="https://avatars.githubusercontent.com/u/9919?s=200&v=4"
					alt="Profile"
					className="profile-pic"
				/>
				<div className="profile-info">
					<h4>Achyutha Vikaram</h4>
					<p>commit -m "coding.."</p>
				</div>
				<button className="close-btn" onClick={toggleRightPanel}>
					<FaTimes />
				</button>
			</div>

			{/* Menu Options */}
			<ul className="profile-menu">
				<li>
					<Link to="/profile">
						<FaUser /> Your Profile
					</Link>
				</li>
				<li>
					<Link to="/user/repositories">
						<FaBook /> Your Repositories
					</Link>
				</li>
				<li>
					<Link to="/copilot">
						<FaRobot /> Your Copilot
					</Link>
				</li>
				<li>
					<Link to="/projects">
						<FaFolder /> Your Projects
					</Link>
				</li>
				<li>
					<Link to="/stars">
						<FaStar /> Your Stars
					</Link>
				</li>
				<li>
					<Link to="/gists">
						<FaCode /> Your Gists
					</Link>
				</li>
				<li>
					<Link to="/organizations">
						<FaUsers /> Your Organizations
					</Link>
				</li>
				<li>
					<Link to="/enterprises">
						<FaBuilding /> Your Enterprises
					</Link>
				</li>
				<li>
					<Link to="/sponsors">
						<FaHeart /> Your Sponsors
					</Link>
				</li>
			</ul>

			{/* Footer Links */}
			<div className="profile-footer">
				<Link to="/enterprise">Try Enterprise (Free)</Link>
				<Link to="/feature-preview">Feature Preview</Link>
				<Link to="/settings"><FaCogs /> Settings</Link>
				<Link to="/github-website">GitHub Website</Link>
				<Link to="/github-docs">GitHub Docs</Link>
			</div>

			{/* Logout Button */}
			<button className="logout-btn" onClick={() => alert("Logged out!")}>
				<FaSignOutAlt /> Logout
			</button>
		</div>
	);
};

export default RightPanel;

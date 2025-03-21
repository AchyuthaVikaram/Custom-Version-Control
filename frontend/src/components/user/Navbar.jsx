import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaBell, FaPlus, FaUserCircle, FaBars } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { Tooltip } from "react-tooltip";
import "./navbar.css";

const Navbar = () => {
	const [showLeftPanel, setShowLeftPanel] = useState(false);
	const [showRightPanel, setShowRightPanel] = useState(false);

	// Close panels when clicking outside
	const handleOutsideClick = (e) => {
		if (!e.target.closest(".left-panel") && !e.target.closest(".menu-btn")) {
			setShowLeftPanel(false);
		}
		if (
			!e.target.closest(".right-panel") &&
			!e.target.closest(".profile-btn")
		) {
			setShowRightPanel(false);
		}
	};

	React.useEffect(() => {
		document.addEventListener("click", handleOutsideClick);
		return () => document.removeEventListener("click", handleOutsideClick);
	}, []);

	return (
		<nav className="navbar">
			{/* Left Section: Menu Icon & Dashboard */}
			<div className="nav-left">
				<button
					className="menu-btn"
					onClick={() => setShowLeftPanel(!showLeftPanel)}
				>
					<FaBars size={20} />
				</button>
				<Link to="/" className="logo">
					<FaGithub size={30} />
					<span>Dashboard</span>
				</Link>
			</div>

			{/* Middle Section: Search Bar */}
			<div className="nav-middle">
				{/* <div className="search-box">
          <FiSearch size={18} />
          <input type="text" placeholder="Type / to search" />
        </div> */}
			</div>

			{/* Right Section: Icons */}
			<div className="nav-right">
				<button className="icon-btn" data-tooltip-id="notif-tooltip">
					<FaBell size={18} />
				</button>
				<Tooltip id="notif-tooltip" place="bottom" content="Notifications" />

				<button className="icon-btn" data-tooltip-id="create-tooltip">
					<FaPlus size={18} />
				</button>
				<Tooltip
					id="create-tooltip"
					place="bottom"
					content="Create new repository"
				/>

				<button
					className="profile-btn"
					onClick={() => setShowRightPanel(!showRightPanel)}
				>
					<FaUserCircle size={22} />
				</button>
			</div>

			{/* Left Sidebar Panel */}
			{showLeftPanel && (
				<div className="left-panel">
					<ul>
						<li>
							<Link to="/repositories">Repositories</Link>
						</li>
						<li>
							<Link to="/issues">Issues</Link>
						</li>
						<li>
							<button onClick={() => alert("Logged out!")}>Logout</button>
						</li>
					</ul>
				</div>
			)}

			{/* Right Sidebar Panel */}
			{showRightPanel && (
				<div className="right-panel">
					<ul>
						<li>
							<Link to="/profile">Profile</Link>
						</li>
						<li>
							<Link to="/your-repos">Your Repositories</Link>
						</li>
						<li>
							<button onClick={() => alert("Logged out!")}>Logout</button>
						</li>
					</ul>
				</div>
			)}
		</nav>
	);
};

export default Navbar;

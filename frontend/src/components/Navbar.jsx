import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaBell, FaPlus, FaUserCircle, FaBars } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { Tooltip } from "react-tooltip";
import "./navbar.css";
import RightPanel from "./RightPanel";
import LeftPanel from "./LeftPanel";

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

	const toggleRightPanel = () => {
		setShowRightPanel(!showRightPanel);
	};
	const toggleLeftPanel = () => {
		setShowLeftPanel(!showLeftPanel);
	};

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
					<Link to="/repo/new">
						<FaPlus size={18} />{" "}
					</Link>
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
				<LeftPanel
					showLeftPanel={showLeftPanel}
					toggleLeftPanel={toggleLeftPanel}
				/>
			)}

			{/* Right Sidebar Panel */}
			{showRightPanel && (
				<RightPanel
					showRightPanel={showRightPanel}
					toggleRightPanel={toggleRightPanel}
				/>
			)}
		</nav>
	);
};

export default Navbar;

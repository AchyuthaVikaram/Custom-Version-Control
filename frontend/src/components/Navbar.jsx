import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGithub, FaBell, FaPlus, FaUserCircle, FaBars, FaSignOutAlt, FaCode, FaBook } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import "./navbar.css";
import { useAuth } from "../authContext";

const Navbar = () => {
	const [showUserMenu, setShowUserMenu] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const { currUser, setCurrUser } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem("userId");
		localStorage.removeItem("token");
		setCurrUser(null);
		navigate("/auth");
	};

	const handleSearch = (e) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			navigate(`/search?q=${searchQuery}`);
		}
	};

	React.useEffect(() => {
		const handleClickOutside = (e) => {
			if (!e.target.closest(".user-menu-container")) {
				setShowUserMenu(false);
			}
		};
		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, []);

	return (
		<nav className="navbar">
			<div className="navbar-container">
				{/* Left Section */}
				<div className="nav-left">
					<Link to="/" className="nav-logo">
						<FaGithub size={32} />
						<span className="logo-text">CustomGit</span>
					</Link>
					<div className="nav-links">
						<Link to="/" className="nav-link">Dashboard</Link>
						<Link to="/user/repositories" className="nav-link">Repositories</Link>
						<Link to="/explore" className="nav-link">Explore</Link>
					</div>
				</div>

				{/* Middle Section - Search */}
				<div className="nav-middle">
					<form className="search-form" onSubmit={handleSearch}>
						<FiSearch className="search-icon" />
						<input
							type="text"
							className="search-input"
							placeholder="Search repositories..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</form>
				</div>

				{/* Right Section */}
				<div className="nav-right">
					<Link to="/repo/new" className="btn-new-repo">
						<FaPlus /> New
					</Link>
					<button className="nav-icon-btn">
						<FaBell size={18} />
					</button>
					<div className="user-menu-container">
						<button
							className="user-avatar-btn"
							onClick={() => setShowUserMenu(!showUserMenu)}
						>
							<FaUserCircle size={24} />
						</button>
						{showUserMenu && (
							<div className="user-dropdown">
								<div className="dropdown-header">
									<FaUserCircle size={40} />
									<div className="user-info">
										<div className="username">User</div>
										<div className="user-email">user@example.com</div>
									</div>
								</div>
								<div className="dropdown-divider"></div>
								<Link to="/profile" className="dropdown-item">
									<FaUserCircle /> Your Profile
								</Link>
								<Link to="/user/repositories" className="dropdown-item">
									<FaCode /> Your Repositories
								</Link>
								<div className="dropdown-divider"></div>
								<button className="dropdown-item" onClick={handleLogout}>
									<FaSignOutAlt /> Sign Out
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;

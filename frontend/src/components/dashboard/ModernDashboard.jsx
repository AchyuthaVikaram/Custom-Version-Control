import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaBook, FaStar, FaCodeBranch, FaEye, FaLock, 
  FaPlus, FaClock, FaCode, FaGitAlt, FaFire 
} from "react-icons/fa";
import Navbar from "../Navbar";
import api from "../../api";
import BASE_URL from "../../constant";
import { getTimeAgo, languageColors } from "../../utils/mockData";
import "./modernDashboard.css";

export default function ModernDashboard() {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserRepositories();
  }, []);

  const fetchUserRepositories = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const res = await api.get(`${BASE_URL}/repo/user/${userId}`);
      setRepositories(res.data.repos || []);
    } catch (error) {
      console.error("Error fetching repositories:", error);
      setRepositories([]);
    } finally {
      setLoading(false);
    }
  };

  const RepositoryCard = ({ repo }) => (
    <div className="repo-card" onClick={() => navigate(`/repo/${repo._id}`)}>
      <div className="repo-card-header">
        <div className="repo-title">
          <FaBook className="repo-icon" />
          <div>
            <h3 className="repo-name">{repo.name}</h3>
            <div className="repo-visibility">
              {repo.visibility ? (
                <>
                  <FaEye size={12} /> Public
                </>
              ) : (
                <>
                  <FaLock size={12} /> Private
                </>
              )}
            </div>
          </div>
        </div>
        <div className="repo-stats-mini">
          <span className="stat-item">
            <FaStar /> {repo.stars || 0}
          </span>
        </div>
      </div>

      <p className="repo-description">
        {repo.description || "No description provided"}
      </p>

      <div className="repo-card-footer">
        <div className="repo-meta">
          {repo.language && (
            <span className="language-tag">
              <span 
                className="language-dot" 
                style={{ backgroundColor: languageColors[repo.language] || "#8b949e" }}
              />
              {repo.language}
            </span>
          )}
          <span className="updated-time">
            <FaClock size={12} /> Updated {getTimeAgo(repo.updatedAt)}
          </span>
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => {
    const getActivityIcon = () => {
      switch (activity.type) {
        case "commit": return <FaGitAlt className="activity-icon commit" />;
        case "star": return <FaStar className="activity-icon star" />;
        case "fork": return <FaCodeBranch className="activity-icon fork" />;
        case "issue": return <FaFire className="activity-icon issue" />;
        default: return <FaCode className="activity-icon" />;
      }
    };

    return (
      <div className="activity-item">
        {getActivityIcon()}
        <div className="activity-content">
          <p className="activity-message">{activity.message}</p>
          <span className="activity-time">{getTimeAgo(activity.timestamp)}</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="dashboard-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-grid">
          {/* Main Content */}
          <main className="dashboard-main">
            <div className="dashboard-header">
              <h1>Dashboard</h1>
              <Link to="/repo/new" className="btn btn-primary">
                <FaPlus /> New Repository
              </Link>
            </div>

            {/* Tabs */}
            <div className="tabs">
              <button 
                className={`tab ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button 
                className={`tab ${activeTab === "repositories" ? "active" : ""}`}
                onClick={() => setActiveTab("repositories")}
              >
                Repositories
              </button>
              <button 
                className={`tab ${activeTab === "activity" ? "active" : ""}`}
                onClick={() => setActiveTab("activity")}
              >
                Activity
              </button>
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="overview-section">
                <div className="section-header">
                  <h2>Recent Repositories</h2>
                  <Link to="/user/repositories" className="view-all-link">
                    View all →
                  </Link>
                </div>
                <div className="repos-grid">
                  {repositories.slice(0, 6).map((repo) => (
                    <RepositoryCard key={repo._id} repo={repo} />
                  ))}
                  {repositories.length === 0 && (
                    <div className="empty-state">
                      <FaBook size={48} />
                      <h3>No repositories yet</h3>
                      <p>Create your first repository to get started</p>
                      <Link to="/repo/new" className="btn btn-primary">
                        <FaPlus /> Create Repository
                      </Link>
                    </div>
                  )}
                </div>

                <div className="section-header" style={{ marginTop: "32px" }}>
                  <h2>Recent Activity</h2>
                </div>
                <div className="activity-feed">
                  <div className="activity-item">
                    <FaGitAlt className="activity-icon commit" />
                    <div className="activity-content">
                      <p className="activity-message">Recent activity will appear here</p>
                      <span className="activity-time">Connect with repositories to see activity</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Repositories Tab */}
            {activeTab === "repositories" && (
              <div className="repositories-section">
                <div className="section-header">
                  <h2>All Repositories ({repositories.length})</h2>
                </div>
                <div className="repos-grid">
                  {repositories.map((repo) => (
                    <RepositoryCard key={repo._id} repo={repo} />
                  ))}
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === "activity" && (
              <div className="activity-section">
                <div className="section-header">
                  <h2>Your Activity</h2>
                </div>
                <div className="activity-feed">
                  <div className="activity-item">
                    <FaGitAlt className="activity-icon commit" />
                    <div className="activity-content">
                      <p className="activity-message">Your activity history will appear here</p>
                      <span className="activity-time">Start creating repositories and commits to see activity</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="dashboard-sidebar">
            <div className="sidebar-card">
              <h3>Quick Stats</h3>
              <div className="stats-list">
                <div className="stat-row">
                  <span className="stat-label">
                    <FaBook /> Repositories
                  </span>
                  <span className="stat-value">{repositories.length}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">
                    <FaStar /> Total Stars
                  </span>
                  <span className="stat-value">
                    {repositories.reduce((sum, repo) => sum + (repo.stars || 0), 0)}
                  </span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">
                    <FaCodeBranch /> Total Forks
                  </span>
                  <span className="stat-value">
                    {repositories.reduce((sum, repo) => sum + (repo.forks || 0), 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="sidebar-card">
              <h3>Trending Repositories</h3>
              <div className="trending-list">
                <div className="trending-item">
                  <div className="trending-info">
                    <p className="trending-name">Explore repositories</p>
                    <p className="trending-desc">Discover popular repositories from the community</p>
                  </div>
                  <div className="trending-stats">
                    <FaStar /> --
                  </div>
                </div>
              </div>
            </div>

            <div className="sidebar-card">
              <h3>Popular Topics</h3>
              <div className="topics-list">
                {["react", "nodejs", "python", "javascript", "typescript", "docker"].map((topic) => (
                  <span key={topic} className="topic-tag">{topic}</span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

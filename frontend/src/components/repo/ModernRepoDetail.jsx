import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  FaStar, FaCodeBranch, FaEye, FaLock, FaCode, FaBook, 
  FaClock, FaTag, FaExclamationCircle, FaGitAlt, FaCog,
  FaFolder, FaFile, FaChevronRight
} from "react-icons/fa";
import api from "../../api";
import BASE_URL from "../../constant";
import Navbar from "../Navbar";
import IssueList from "../issues/IssueList";
import IssueForm from "../issues/IssueForm";
import EditRepo from "./EditRepo";
import { getTimeAgo, languageColors } from "../../utils/mockData";
import "./modernRepoDetail.css";

const ModernRepoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("code");
  const [currentPath, setCurrentPath] = useState([]);
  const [showEditRepo, setShowEditRepo] = useState(false);

  const fetchRepo = async () => {
    try {
      setLoading(true);
      const res = await api.get(`${BASE_URL}/repo/${id}`);
      setRepo(res.data.repo);
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || "Failed to load repository");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepo();
  }, [id]);

  const handleToggleVisibility = async () => {
    try {
      await api.patch(`${BASE_URL}/repo/toggle/${id}`);
      await fetchRepo();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to toggle visibility");
    }
  };

  // Mock file tree for demo
  const fileTree = [
    { name: "src", type: "folder", children: [
      { name: "components", type: "folder", children: [
        { name: "Header.jsx", type: "file", size: "2.4 KB" },
        { name: "Footer.jsx", type: "file", size: "1.8 KB" },
      ]},
      { name: "utils", type: "folder", children: [
        { name: "helpers.js", type: "file", size: "3.2 KB" },
      ]},
      { name: "App.jsx", type: "file", size: "5.6 KB" },
      { name: "index.js", type: "file", size: "892 B" },
    ]},
    { name: "public", type: "folder", children: [
      { name: "index.html", type: "file", size: "1.2 KB" },
      { name: "favicon.ico", type: "file", size: "4.2 KB" },
    ]},
    { name: "package.json", type: "file", size: "1.5 KB" },
    { name: "README.md", type: "file", size: "3.8 KB" },
    { name: ".gitignore", type: "file", size: "245 B" },
  ];

  const FileTreeItem = ({ item, level = 0 }) => {
    const [isOpen, setIsOpen] = useState(level === 0);

    if (item.type === "folder") {
      return (
        <div className="file-tree-folder">
          <div 
            className="file-tree-item" 
            style={{ paddingLeft: `${level * 20 + 12}px` }}
            onClick={() => setIsOpen(!isOpen)}
          >
            <FaChevronRight className={`folder-icon ${isOpen ? "open" : ""}`} />
            <FaFolder className="item-icon folder" />
            <span className="item-name">{item.name}</span>
          </div>
          {isOpen && item.children && (
            <div className="folder-children">
              {item.children.map((child, idx) => (
                <FileTreeItem key={idx} item={child} level={level + 1} />
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div 
        className="file-tree-item" 
        style={{ paddingLeft: `${level * 20 + 32}px` }}
      >
        <FaFile className="item-icon file" />
        <span className="item-name">{item.name}</span>
        <span className="item-size">{item.size}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="repo-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading repository...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !repo) {
    return (
      <>
        <Navbar />
        <div className="repo-container">
          <div className="error-state">
            <FaExclamationCircle size={48} />
            <h3>Repository not found</h3>
            <p>{error || "The repository you're looking for doesn't exist."}</p>
            <Link to="/" className="btn btn-primary">Go to Dashboard</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="repo-container">
        {/* Repository Header */}
        <div className="repo-header">
          <div className="repo-title-section">
            <div className="repo-breadcrumb">
              <FaBook className="breadcrumb-icon" />
              <Link to={`/profile`} className="breadcrumb-link">
                {repo.owner?.username || "owner"}
              </Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">{repo.name}</span>
            </div>
            <div className="repo-visibility-badge">
              {repo.visibility ? (
                <span className="badge badge-success">
                  <FaEye /> Public
                </span>
              ) : (
                <span className="badge badge-danger">
                  <FaLock /> Private
                </span>
              )}
            </div>
          </div>

          <div className="repo-actions">
            <button className="btn btn-secondary" onClick={() => setShowEditRepo(true)}>
              <FaCog /> Edit Repository
            </button>
            <button className="btn btn-secondary" onClick={handleToggleVisibility}>
              {repo.visibility ? 'Make Private' : 'Make Public'}
            </button>
            <button className="btn btn-secondary">
              <FaStar /> Star
            </button>
          </div>
        </div>

        {/* Repository Stats */}
        <div className="repo-stats-bar">
          <div className="stat-item">
            <FaStar className="stat-icon" />
            <span className="stat-value">{repo.stars}</span>
            <span className="stat-label">stars</span>
          </div>
          <div className="stat-item">
            <FaCodeBranch className="stat-icon" />
            <span className="stat-value">{repo.forks}</span>
            <span className="stat-label">forks</span>
          </div>
          <div className="stat-item">
            <FaEye className="stat-icon" />
            <span className="stat-value">{repo.watchers}</span>
            <span className="stat-label">watchers</span>
          </div>
        </div>

        {/* Description */}
        {repo.description && (
          <div className="repo-description-box">
            <p>{repo.description}</p>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="repo-tabs">
          <button 
            className={`repo-tab ${activeTab === "code" ? "active" : ""}`}
            onClick={() => setActiveTab("code")}
          >
            <FaCode /> Code
          </button>
          <button 
            className={`repo-tab ${activeTab === "issues" ? "active" : ""}`}
            onClick={() => setActiveTab("issues")}
          >
            <FaExclamationCircle /> Issues
            {repo.issues > 0 && <span className="tab-badge">{repo.issues}</span>}
          </button>
          <button 
            className={`repo-tab ${activeTab === "commits" ? "active" : ""}`}
            onClick={() => setActiveTab("commits")}
          >
            <FaGitAlt /> Commits
            <span className="tab-badge">{repo.commits}</span>
          </button>
          <button 
            className={`repo-tab ${activeTab === "vcs" ? "active" : ""}`}
            onClick={() => navigate(`/vcs/${id}`)}
          >
            <FaCodeBranch /> Version Control
          </button>
        </div>

        {/* Tab Content */}
        <div className="repo-content">
          {activeTab === "code" && (
            <div className="code-view">
              <div className="code-header">
                <div className="branch-selector">
                  <FaCodeBranch />
                  <select className="branch-dropdown">
                    <option value="main">main</option>
                    <option value="develop">develop</option>
                  </select>
                  <span className="branch-count">2 branches</span>
                  <span className="tag-count">
                    <FaTag /> 0 tags
                  </span>
                </div>
                <div className="code-actions">
                  <button className="btn btn-primary">
                    <FaCode /> Clone
                  </button>
                </div>
              </div>

              <div className="file-browser">
                <div className="commit-info-bar">
                  <div className="latest-commit">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${repo.owner?.username}`}
                      alt="avatar"
                      className="commit-avatar"
                    />
                    <div className="commit-details">
                      <span className="commit-author">{repo.owner?.username}</span>
                      <span className="commit-message">Initial commit</span>
                    </div>
                  </div>
                  <div className="commit-meta">
                    <span className="commit-sha">abc1234</span>
                    <span className="commit-time">
                      <FaClock /> {getTimeAgo(repo.updatedAt)}
                    </span>
                  </div>
                </div>

                <div className="file-tree">
                  {fileTree.map((item, idx) => (
                    <FileTreeItem key={idx} item={item} />
                  ))}
                </div>
              </div>

              <div className="readme-section">
                <div className="readme-header">
                  <FaBook /> README.md
                </div>
                <div className="readme-content">
                  <h1>{repo.name}</h1>
                  <p>{repo.description}</p>
                  <h2>Installation</h2>
                  <pre><code>npm install</code></pre>
                  <h2>Usage</h2>
                  <p>This is a sample repository showcasing the Custom Version Control System.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "issues" && (
            <div className="issues-view">
              <IssueForm repoId={id} onCreated={fetchRepo} />
              <IssueList repoId={id} onIssueUpdated={fetchRepo} />
            </div>
          )}

          {activeTab === "commits" && (
            <div className="commits-view">
              <div className="commits-header">
                <h3>1 commit</h3>
              </div>
              <div className="commits-list">
                <div className="commit-item">
                  <div className="commit-main">
                    <div className="commit-message">Initial commit</div>
                    <div className="commit-info">
                      <span className="commit-author">{repo.owner?.username}</span>
                      <span className="commit-sha">abc1234</span>
                      <span className="commit-time">{getTimeAgo(repo.createdAt)}</span>
                    </div>
                  </div>
                  <div className="commit-stats">
                    <span className="additions">+1</span>
                    <span className="deletions">-0</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="repo-sidebar">
          <div className="sidebar-section">
            <h4>About</h4>
            <p className="sidebar-description">{repo.description || "No description"}</p>
            {repo.language && (
              <div className="sidebar-item">
                <span 
                  className="language-dot" 
                  style={{ backgroundColor: languageColors[repo.language] }}
                />
                <span>{repo.language}</span>
              </div>
            )}
            <div className="sidebar-item">
              <FaStar />
              <span>{repo.stars} stars</span>
            </div>
            <div className="sidebar-item">
              <FaCodeBranch />
              <span>{repo.forks} forks</span>
            </div>
          </div>

          <div className="sidebar-section">
            <h4>Releases</h4>
            <div className="release-item">
              <FaTag className="release-icon" />
              <div>
                <div className="release-name">No releases yet</div>
                <div className="release-date">Create a tag to make your first release</div>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <h4>Languages</h4>
            <div className="language-bar">
              <div className="language-segment" style={{ width: "65%", backgroundColor: "#f1e05a" }}></div>
              <div className="language-segment" style={{ width: "25%", backgroundColor: "#e34c26" }}></div>
              <div className="language-segment" style={{ width: "10%", backgroundColor: "#563d7c" }}></div>
            </div>
            <div className="language-list">
              <div className="language-item">
                <span className="language-dot" style={{ backgroundColor: "#f1e05a" }}></span>
                <span>JavaScript</span>
                <span className="language-percent">65%</span>
              </div>
              <div className="language-item">
                <span className="language-dot" style={{ backgroundColor: "#e34c26" }}></span>
                <span>HTML</span>
                <span className="language-percent">25%</span>
              </div>
              <div className="language-item">
                <span className="language-dot" style={{ backgroundColor: "#563d7c" }}></span>
                <span>CSS</span>
                <span className="language-percent">10%</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Edit Repository Modal */}
        {showEditRepo && (
          <EditRepo 
            repo={repo}
            onClose={() => setShowEditRepo(false)}
            onUpdated={() => {
              fetchRepo();
              setShowEditRepo(false);
            }}
          />
        )}
      </div>
    </>
  );
};

export default ModernRepoDetail;

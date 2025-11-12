import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaUser, FaMapMarkerAlt, FaLink, FaCalendarAlt, FaEdit, 
  FaStar, FaCodeBranch, FaBook, FaUsers, FaCode, FaFire,
  FaGithub, FaTwitter, FaLinkedin, FaEnvelope, FaCog,
  FaChartLine, FaAward, FaTrophy, FaRocket
} from "react-icons/fa";
import { useAuth } from "../../authContext";
import { userAPI, repoAPI } from "../../utils/api";
import HeatMapProfile from "./HeatMap";
import Navbar from "../Navbar";
import "./modernProfile.css";

const ModernProfile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});
  const [userStats, setUserStats] = useState({
    totalRepos: 0,
    totalStars: 0,
    totalForks: 0,
    totalCommits: 0,
    publicRepos: 0,
    privateRepos: 0,
    languages: [],
    joinDate: null
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [repositories, setRepositories] = useState([]);
  const [repositoriesLoading, setRepositoriesLoading] = useState(false);
  const { setCurrUser } = useAuth();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");
      
      if (userId) {
        try {
          const response = await userAPI.getUserProfile(userId);
          const user = response.data.user;
          setUserDetails(user);
          setEditFormData({
            username: user.username || '',
            email: user.email || '',
            bio: user.bio || '',
            location: user.location || '',
            website: user.website || ''
          });
          
          // Fetch user repositories
          await fetchUserRepositories(userId);
          
          setLoading(false);
        } catch (err) {
          console.error('Error fetching user profile:', err);
          setError(err?.response?.data?.message || 'Failed to fetch user profile');
          setLoading(false);
        }
      } else {
        setError('No user ID found. Please log in again.');
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, []);

  const fetchUserRepositories = async (userId) => {
    try {
      setRepositoriesLoading(true);
      const response = await repoAPI.getUserRepositories(userId);
      const repos = response.data.repos || [];
      setRepositories(repos);
      
      // Calculate real statistics from repository data
      const publicRepos = repos.filter(repo => repo.visibility === true).length;
      const privateRepos = repos.filter(repo => repo.visibility === false).length;
      const totalStars = repos.reduce((sum, repo) => sum + (repo.stars || 0), 0);
      const totalForks = repos.reduce((sum, repo) => sum + (repo.forks || 0), 0);
      
      // Calculate language statistics
      const languageCount = {};
      repos.forEach(repo => {
        const lang = repo.language || 'JavaScript';
        languageCount[lang] = (languageCount[lang] || 0) + 1;
      });
      
      const totalRepos = repos.length;
      const languages = Object.entries(languageCount).map(([name, count]) => {
        const colors = {
          'JavaScript': '#f1e05a',
          'Python': '#3572A5',
          'TypeScript': '#2b7489',
          'CSS': '#563d7c',
          'HTML': '#e34c26',
          'Java': '#b07219',
          'C++': '#f34b7d',
          'Go': '#00ADD8',
          'Rust': '#dea584',
          'PHP': '#4F5D95'
        };
        return {
          name,
          percentage: Math.round((count / totalRepos) * 100),
          color: colors[name] || '#8b949e'
        };
      }).sort((a, b) => b.percentage - a.percentage);
      
      setUserStats({
        totalRepos: totalRepos,
        totalStars: totalStars,
        totalForks: totalForks,
        totalCommits: 0, // This would need commit data from VCS
        publicRepos: publicRepos,
        privateRepos: privateRepos,
        languages: languages,
        joinDate: userDetails.createdAt || new Date('2024-01-15')
      });
      
      setRepositoriesLoading(false);
    } catch (err) {
      console.error('Error fetching repositories:', err);
      setRepositoriesLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setCurrUser(null);
    window.location.href = "/auth";
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({
      username: userDetails.username || '',
      email: userDetails.email || '',
      bio: userDetails.bio || '',
      location: userDetails.location || '',
      website: userDetails.website || ''
    });
  };

  const handleSaveProfile = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await userAPI.updateUserProfile(userId, editFormData);
      setUserDetails(response.data.user);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert(err?.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="modern-profile-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="modern-profile-container">
          <div className="error-message">
            <h3>Error Loading Profile</h3>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="modern-profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-cover">
            <div className="cover-gradient"></div>
          </div>
          
          <div className="profile-info">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userDetails.username}`}
                  alt={userDetails.username}
                />
                <div className="status-indicator online"></div>
              </div>
              
              <div className="profile-actions">
                {!isEditing ? (
                  <>
                    <button className="btn btn-primary" onClick={handleEditProfile}>
                      <FaEdit size={14} /> Edit Profile
                    </button>
                    <button className="btn btn-secondary">
                      <FaCog size={14} /> Settings
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-success" onClick={handleSaveProfile}>
                      Save Changes
                    </button>
                    <button className="btn btn-secondary" onClick={handleCancelEdit}>
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="profile-details">
              <div className="profile-name-section">
                {!isEditing ? (
                  <>
                    <h1 className="profile-name">{userDetails.username}</h1>
                    <p className="profile-handle">@{userDetails.username}</p>
                  </>
                ) : (
                  <div className="edit-form-group">
                    <input
                      type="text"
                      name="username"
                      value={editFormData.username}
                      onChange={handleInputChange}
                      className="edit-input"
                      placeholder="Username"
                    />
                  </div>
                )}
                <div className="profile-badges">
                  <span className="badge pro-badge">
                    <FaTrophy size={12} /> Pro Developer
                  </span>
                  <span className="badge verified-badge">
                    <FaAward size={12} /> Verified
                  </span>
                </div>
              </div>

              <div className="profile-bio">
                {!isEditing ? (
                  <p>{userDetails.bio || '🚀 Full-stack developer passionate about building amazing web applications. Love working with React, Node.js, and modern web technologies.'}</p>
                ) : (
                  <textarea
                    name="bio"
                    value={editFormData.bio}
                    onChange={handleInputChange}
                    className="edit-textarea"
                    placeholder="Tell us about yourself..."
                    rows="3"
                  />
                )}
              </div>

              <div className="profile-meta">
                <div className="meta-item">
                  <FaMapMarkerAlt size={14} />
                  {!isEditing ? (
                    <span>{userDetails.location || 'Location not specified'}</span>
                  ) : (
                    <input
                      type="text"
                      name="location"
                      value={editFormData.location}
                      onChange={handleInputChange}
                      className="edit-input-small"
                      placeholder="Location"
                    />
                  )}
                </div>
                <div className="meta-item">
                  <FaLink size={14} />
                  {!isEditing ? (
                    userDetails.website ? (
                      <a href={userDetails.website} target="_blank" rel="noopener noreferrer">
                        {userDetails.website}
                      </a>
                    ) : (
                      <span>No website</span>
                    )
                  ) : (
                    <input
                      type="url"
                      name="website"
                      value={editFormData.website}
                      onChange={handleInputChange}
                      className="edit-input-small"
                      placeholder="https://yourwebsite.com"
                    />
                  )}
                </div>
                <div className="meta-item">
                  <FaCalendarAlt size={14} />
                  <span>Joined {formatDate(userStats.joinDate)}</span>
                </div>
                <div className="meta-item">
                  <FaEnvelope size={14} />
                  {!isEditing ? (
                    <span>{userDetails.email}</span>
                  ) : (
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleInputChange}
                      className="edit-input-small"
                      placeholder="Email"
                    />
                  )}
                </div>
              </div>

              <div className="social-links">
                <a href="#" className="social-link github">
                  <FaGithub size={16} />
                </a>
                <a href="#" className="social-link twitter">
                  <FaTwitter size={16} />
                </a>
                <a href="#" className="social-link linkedin">
                  <FaLinkedin size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon repositories">
              <FaBook size={24} />
            </div>
            <div className="stat-content">
              <h3>{userStats.totalRepos}</h3>
              <p>Repositories</p>
              <span className="stat-detail">{userStats.publicRepos} public, {userStats.privateRepos} private</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stars">
              <FaStar size={24} />
            </div>
            <div className="stat-content">
              <h3>{userStats.totalStars}</h3>
              <p>Stars Earned</p>
              <span className="stat-detail">+127 this month</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon forks">
              <FaCodeBranch size={24} />
            </div>
            <div className="stat-content">
              <h3>{userStats.totalForks}</h3>
              <p>Forks</p>
              <span className="stat-detail">+23 this month</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon commits">
              <FaRocket size={24} />
            </div>
            <div className="stat-content">
              <h3>{userStats.totalCommits}</h3>
              <p>Contributions</p>
              <span className="stat-detail">+89 this month</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="profile-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FaChartLine size={16} /> Overview
          </button>
          <button 
            className={`tab ${activeTab === 'repositories' ? 'active' : ''}`}
            onClick={() => setActiveTab('repositories')}
          >
            <FaBook size={16} /> Repositories
          </button>
          <button 
            className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            <FaFire size={16} /> Activity
          </button>
          <button 
            className={`tab ${activeTab === 'following' ? 'active' : ''}`}
            onClick={() => setActiveTab('following')}
          >
            <FaUsers size={16} /> Following
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-content">
              <div className="content-grid">
                <div className="content-section">
                  <div className="section-header">
                    <h3><FaCode size={18} /> Top Languages</h3>
                  </div>
                  <div className="languages-chart">
                    {userStats.languages.map((lang, index) => (
                      <div key={index} className="language-item">
                        <div className="language-info">
                          <span 
                            className="language-dot" 
                            style={{ backgroundColor: lang.color }}
                          ></span>
                          <span className="language-name">{lang.name}</span>
                          <span className="language-percentage">{lang.percentage}%</span>
                        </div>
                        <div className="language-bar">
                          <div 
                            className="language-progress" 
                            style={{ 
                              width: `${lang.percentage}%`,
                              backgroundColor: lang.color 
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="content-section">
                  <div className="section-header">
                    <h3><FaFire size={18} /> Contribution Activity</h3>
                  </div>
                  <div className="heatmap-container">
                    <HeatMapProfile />
                  </div>
                </div>
              </div>

              <div className="achievements-section">
                <div className="section-header">
                  <h3><FaTrophy size={18} /> Achievements</h3>
                </div>
                <div className="achievements-grid">
                  <div className="achievement-card earned">
                    <div className="achievement-icon">🏆</div>
                    <div className="achievement-info">
                      <h4>First Repository</h4>
                      <p>Created your first repository</p>
                    </div>
                  </div>
                  <div className="achievement-card earned">
                    <div className="achievement-icon">⭐</div>
                    <div className="achievement-info">
                      <h4>Star Collector</h4>
                      <p>Earned 100+ stars</p>
                    </div>
                  </div>
                  <div className="achievement-card earned">
                    <div className="achievement-icon">🔥</div>
                    <div className="achievement-info">
                      <h4>Streak Master</h4>
                      <p>30-day contribution streak</p>
                    </div>
                  </div>
                  <div className="achievement-card locked">
                    <div className="achievement-icon">🚀</div>
                    <div className="achievement-info">
                      <h4>Open Source Hero</h4>
                      <p>Contribute to 10 open source projects</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'repositories' && (
            <div className="repositories-content">
              <div className="repositories-header">
                <h3>Repositories ({repositories.length})</h3>
                <button className="btn btn-primary" onClick={() => navigate('/user/repositories')}>
                  View All Repositories
                </button>
              </div>
              {repositoriesLoading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>Loading repositories...</p>
                </div>
              ) : repositories.length > 0 ? (
                <div className="repositories-grid">
                  {repositories.map((repo) => (
                    <div key={repo._id} className="repo-card" onClick={() => navigate(`/repo/${repo._id}`)}>
                      <div className="repo-header">
                        <h4>{repo.name}</h4>
                        <span className={`visibility-badge ${repo.visibility ? 'public' : 'private'}`}>
                          {repo.visibility ? 'Public' : 'Private'}
                        </span>
                      </div>
                      <p>{repo.description || 'No description available'}</p>
                      <div className="repo-stats">
                        <span><FaStar size={12} /> {repo.stars || 0}</span>
                        <span><FaCodeBranch size={12} /> {repo.forks || 0}</span>
                        <span className="language">{repo.language || 'JavaScript'}</span>
                      </div>
                      <div className="repo-meta">
                        <span>Updated {new Date(repo.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <FaBook size={48} />
                  <h3>No repositories yet</h3>
                  <p>Create your first repository to get started!</p>
                  <button className="btn btn-primary" onClick={() => navigate('/repo/new')}>
                    Create Repository
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="activity-content">
              <h3>Recent Activity</h3>
              <div className="activity-feed">
                <div className="activity-item">
                  <div className="activity-icon">
                    <FaStar size={14} />
                  </div>
                  <div className="activity-content">
                    <p><strong>Starred</strong> react-dashboard repository</p>
                    <span className="activity-time">2 hours ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">
                    <FaCodeBranch size={14} />
                  </div>
                  <div className="activity-content">
                    <p><strong>Created</strong> new branch feature/dark-mode</p>
                    <span className="activity-time">5 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'following' && (
            <div className="following-content">
              <h3>Following</h3>
              <div className="users-grid">
                <div className="user-card">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=john" alt="John" />
                  <h4>John Doe</h4>
                  <p>@johndoe</p>
                  <button className="btn btn-secondary btn-sm">Following</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button className="logout-btn" onClick={handleLogout}>
          <FaCog size={16} /> Logout
        </button>
      </div>
    </>
  );
};

export default ModernProfile;

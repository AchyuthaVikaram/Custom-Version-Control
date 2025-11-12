import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Heading, Box, Button, Label } from "@primer/react";
import api from "../../api";
import BASE_URL from "../../constant";
import Navbar from "../Navbar";
import IssueList from "../issues/IssueList";
import IssueForm from "../issues/IssueForm";

const RepoDetail = () => {
  const { id } = useParams();
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

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

  if (loading) return <div>Loading repository...</div>;
  if (error) return <div style={{ color: "#f66" }}>{error}</div>;
  if (!repo) return <div>Repository not found</div>;

  const issuesRepoId = repo._id;

  return (
    <>
      <Navbar />
      <div className="container" style={{ marginTop: 24, marginBottom: 24 }}>
        <Heading as="h2">{repo.name}</Heading>
        <p style={{ color: "#8b949e", marginTop: 8 }}>{repo.description || "No description"}</p>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
          <Label variant="accent">{repo.visibility ? "Public" : "Private"}</Label>
          <Button size="small" onClick={handleToggleVisibility}>
            Toggle Visibility
          </Button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 16, marginTop: 24, borderBottom: "1px solid #30363d", paddingBottom: 8 }}>
          <button
            style={{
              background: activeTab === "overview" ? "#21262d" : "transparent",
              color: "#c9d1d9",
              border: "1px solid #30363d",
              borderBottom: activeTab === "overview" ? "2px solid #58a6ff" : "1px solid #30363d",
              padding: "6px 12px",
              borderRadius: 6,
            }}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            style={{
              background: activeTab === "issues" ? "#21262d" : "transparent",
              color: "#c9d1d9",
              border: "1px solid #30363d",
              borderBottom: activeTab === "issues" ? "2px solid #58a6ff" : "1px solid #30363d",
              padding: "6px 12px",
              borderRadius: 6,
            }}
            onClick={() => setActiveTab("issues")}
          >
            Issues
          </button>
          <Link to={`/vcs/${id}`} style={{ textDecoration: "none" }}>
            <button
              style={{
                background: "transparent",
                color: "#c9d1d9",
                border: "1px solid #30363d",
                padding: "6px 12px",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Version Control
            </button>
          </Link>
        </div>

        {activeTab === "overview" && (
          <Box sx={{ paddingY: 3 }}>
            <Heading as="h4">Content</Heading>
            {(repo.content && repo.content.length > 0) ? (
              <ul>
                {repo.content.map((item, idx) => (
                  <li key={idx} style={{ color: "#c9d1d9" }}>{item}</li>
                ))}
              </ul>
            ) : (
              <p style={{ color: "#8b949e" }}>No content yet.</p>
            )}
          </Box>
        )}

        {activeTab === "issues" && (
          <Box sx={{ paddingY: 3 }}>
            <IssueForm repoId={issuesRepoId} onCreated={fetchRepo} />
            <IssueList repoId={issuesRepoId} />
          </Box>
        )}
      </div>
    </>
  );
};

export default RepoDetail;

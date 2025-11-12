import React, { useEffect, useState } from "react";
import api from "../../api";
import BASE_URL from "../../constant";
import { Label, Button } from "@primer/react";

const StatusBadge = ({ status }) => (
  <Label variant={status === "Open" ? "success" : "attention"}>{status}</Label>
);

const IssueList = ({ repoId }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const res = await api.get(`${BASE_URL}/issue/all/${repoId}`);
      setIssues(res.data.issues || []);
    } catch (e) {
      // API returns 200 with [] when none; other errors shown below
      setError(e?.response?.data?.message || "Failed to load issues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (repoId) fetchIssues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repoId]);

  const handleDelete = async (issueId) => {
    if (!window.confirm("Delete this issue?")) return;
    try {
      await api.delete(`${BASE_URL}/issue/delete/${issueId}`);
      setIssues((prev) => prev.filter((i) => i._id !== issueId));
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to delete issue");
    }
  };

  if (loading) return <div>Loading issues...</div>;
  if (error) return <div style={{ color: "#f66" }}>{error}</div>;

  return (
    <div style={{ marginTop: 12 }}>
      {issues.length === 0 ? (
        <p style={{ color: "#8b949e" }}>No issues yet.</p>) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {issues.map((issue) => (
            <li key={issue._id} style={{
              borderBottom: "1px solid #30363d",
              padding: "12px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <StatusBadge status={issue.status} />
                <div>
                  <div style={{ fontWeight: 600 }}>{issue.title}</div>
                  <div style={{ color: "#8b949e", fontSize: 14 }}>{issue.description}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {/* Future: edit inline */}
                <Button size="small" variant="danger" onClick={() => handleDelete(issue._id)}>Delete</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default IssueList;

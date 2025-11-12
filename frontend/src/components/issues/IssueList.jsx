import React, { useEffect, useState } from "react";
import api from "../../api";
import BASE_URL from "../../constant";
import { Label, Button } from "@primer/react";
import { FaExclamationCircle, FaCheckCircle, FaClock, FaUser, FaCalendarAlt, FaEdit } from "react-icons/fa";
import EditIssue from "./EditIssue";

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return { variant: 'success', icon: FaExclamationCircle, color: '#28a745' };
      case 'closed':
        return { variant: 'secondary', icon: FaCheckCircle, color: '#6c757d' };
      case 'in_progress':
        return { variant: 'attention', icon: FaClock, color: '#ffc107' };
      default:
        return { variant: 'secondary', icon: FaExclamationCircle, color: '#6c757d' };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <Icon size={12} style={{ color: config.color }} />
      <Label variant={config.variant}>
        {status === 'in_progress' ? 'In Progress' : status?.charAt(0).toUpperCase() + status?.slice(1)}
      </Label>
    </div>
  );
};

const PriorityBadge = ({ priority }) => {
  const getPriorityConfig = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return { color: '#dc3545', bg: '#f8d7da', text: 'High' };
      case 'medium':
        return { color: '#fd7e14', bg: '#ffeaa7', text: 'Medium' };
      case 'low':
        return { color: '#28a745', bg: '#d4edda', text: 'Low' };
      default:
        return { color: '#6c757d', bg: '#e9ecef', text: 'Normal' };
    }
  };

  const config = getPriorityConfig(priority);

  return (
    <span style={{
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '600',
      color: config.color,
      backgroundColor: config.bg,
      border: `1px solid ${config.color}20`
    }}>
      {config.text}
    </span>
  );
};

const LabelBadge = ({ label }) => (
  <span style={{
    padding: '2px 6px',
    borderRadius: '8px',
    fontSize: '10px',
    fontWeight: '500',
    color: '#0366d6',
    backgroundColor: '#f1f8ff',
    border: '1px solid #c8e1ff'
  }}>
    {label}
  </span>
);

const IssueList = ({ repoId, onIssueUpdated }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingIssue, setEditingIssue] = useState(null);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <div style={{ marginTop: 12 }}>
      {issues.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px',
          color: "#8b949e",
          backgroundColor: '#0d1117',
          border: '1px solid #30363d',
          borderRadius: '8px'
        }}>
          <FaExclamationCircle size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
          <p style={{ margin: 0, fontSize: '16px' }}>No issues yet</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', opacity: 0.7 }}>Create an issue to get started</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {issues.map((issue) => (
            <div key={issue._id} style={{
              backgroundColor: '#0d1117',
              border: "1px solid #30363d",
              borderRadius: '8px',
              padding: "16px",
              transition: 'border-color 0.2s ease',
              ':hover': {
                borderColor: '#58a6ff'
              }
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: '12px' }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: 'wrap' }}>
                  <StatusBadge status={issue.status} />
                  <PriorityBadge priority={issue.priority} />
                  {issue.labels && issue.labels.length > 0 && (
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {issue.labels.slice(0, 3).map((label, idx) => (
                        <LabelBadge key={idx} label={label} />
                      ))}
                      {issue.labels.length > 3 && (
                        <span style={{ fontSize: '11px', color: '#8b949e' }}>+{issue.labels.length - 3} more</span>
                      )}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button 
                    size="small" 
                    variant="secondary" 
                    onClick={() => setEditingIssue(issue)}
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <FaEdit size={10} /> Edit
                  </Button>
                  <Button size="small" variant="danger" onClick={() => handleDelete(issue._id)}>
                    Delete
                  </Button>
                </div>
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <h4 style={{ 
                  margin: '0 0 8px 0', 
                  fontWeight: 600, 
                  fontSize: '16px',
                  color: '#c9d1d9',
                  lineHeight: '1.25'
                }}>
                  {issue.title}
                </h4>
                <p style={{ 
                  color: "#8b949e", 
                  fontSize: 14, 
                  margin: 0,
                  lineHeight: '1.5',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {issue.description}
                </p>
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px',
                fontSize: '12px',
                color: '#8b949e'
              }}>
                {issue.author && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FaUser size={10} />
                    <span>{issue.author.username || 'Unknown'}</span>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FaCalendarAlt size={10} />
                  <span>Created {formatDate(issue.createdAt)}</span>
                </div>
                {issue.updatedAt !== issue.createdAt && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FaClock size={10} />
                    <span>Updated {formatDate(issue.updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Issue Modal */}
      {editingIssue && (
        <EditIssue 
          issue={editingIssue}
          onClose={() => setEditingIssue(null)}
          onUpdated={() => {
            fetchIssues();
            setEditingIssue(null);
            if (onIssueUpdated) onIssueUpdated();
          }}
        />
      )}
    </div>
  );
};

export default IssueList;

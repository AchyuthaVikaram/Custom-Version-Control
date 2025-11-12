import React, { useState, useEffect } from "react";
import { Box, Button, TextInput, Select } from "@primer/react";
import { FaTimes, FaSave } from "react-icons/fa";
import api from "../../api";
import BASE_URL from "../../constant";

const EditIssue = ({ issue, onClose, onUpdated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("open");
  const [priority, setPriority] = useState("medium");
  const [labels, setLabels] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const commonLabels = [
    'bug', 'enhancement', 'feature', 'documentation', 'testing',
    'security', 'performance', 'ui', 'api', 'mobile', 'accessibility'
  ];

  useEffect(() => {
    if (issue) {
      setTitle(issue.title || "");
      setDescription(issue.description || "");
      setStatus(issue.status || "open");
      setPriority(issue.priority || "medium");
      setLabels(issue.labels ? issue.labels.join(', ') : "");
    }
  }, [issue]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Title is required");
    
    const labelsArray = labels
      .split(',')
      .map(label => label.trim())
      .filter(label => label.length > 0);
    
    try {
      setSubmitting(true);
      await api.put(`${BASE_URL}/issue/update/${issue._id}`, {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        labels: labelsArray
      });
      
      if (onUpdated) onUpdated();
      if (onClose) onClose();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to update issue");
    } finally {
      setSubmitting(false);
    }
  };

  const addLabel = (label) => {
    const currentLabels = labels.split(',').map(l => l.trim()).filter(l => l.length > 0);
    if (!currentLabels.includes(label)) {
      const newLabels = [...currentLabels, label].join(', ');
      setLabels(newLabels);
    }
  };

  if (!issue) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#0d1117',
        border: '1px solid #30363d',
        borderRadius: '12px',
        padding: '24px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0, color: '#c9d1d9', fontSize: '20px' }}>
            Edit Issue
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#8b949e',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <FaTimes size={16} />
          </button>
        </div>

        <Box as="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 16 }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              fontSize: '14px', 
              color: '#c9d1d9',
              fontWeight: '600'
            }}>
              Title *
            </label>
            <TextInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Issue title"
              sx={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '14px', 
                color: '#c9d1d9',
                fontWeight: '600'
              }}>
                Status
              </label>
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <Select.Option value="open">Open</Select.Option>
                <Select.Option value="in_progress">In Progress</Select.Option>
                <Select.Option value="closed">Closed</Select.Option>
              </Select>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '14px', 
                color: '#c9d1d9',
                fontWeight: '600'
              }}>
                Priority
              </label>
              <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <Select.Option value="low">Low</Select.Option>
                <Select.Option value="medium">Medium</Select.Option>
                <Select.Option value="high">High</Select.Option>
              </Select>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '14px', 
                color: '#c9d1d9',
                fontWeight: '600'
              }}>
                Labels
              </label>
              <TextInput
                value={labels}
                onChange={(e) => setLabels(e.target.value)}
                placeholder="bug, enhancement"
                sx={{ width: '100%', fontSize: 12 }}
              />
            </div>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              fontSize: '14px', 
              color: '#c9d1d9',
              fontWeight: '600'
            }}>
              Common Labels
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {commonLabels.map(label => (
                <button
                  key={label}
                  type="button"
                  onClick={() => addLabel(label)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '500',
                    color: '#0366d6',
                    backgroundColor: 'transparent',
                    border: '1px solid #0366d6',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#0366d6';
                    e.target.style.color = 'white';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#0366d6';
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              fontSize: '14px', 
              color: '#c9d1d9',
              fontWeight: '600'
            }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '12px',
                backgroundColor: '#0d1117',
                border: '1px solid #30363d',
                borderRadius: '6px',
                color: '#c9d1d9',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ 
            display: 'flex', 
            gap: 12, 
            justifyContent: 'flex-end',
            marginTop: '8px'
          }}>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={submitting} 
              variant="primary"
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <FaSave size={12} />
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default EditIssue;

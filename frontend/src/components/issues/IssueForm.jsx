import React, { useState } from "react";
import { Box, Button, TextInput, Select } from "@primer/react";
import api from "../../api";
import BASE_URL from "../../constant";

const IssueForm = ({ repoId, onCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [labels, setLabels] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const commonLabels = [
    'bug', 'enhancement', 'feature', 'documentation', 'testing',
    'security', 'performance', 'ui', 'api', 'mobile', 'accessibility'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Title is required");
    
    const labelsArray = labels
      .split(',')
      .map(label => label.trim())
      .filter(label => label.length > 0);
    
    try {
      setSubmitting(true);
      await api.post(`${BASE_URL}/issue/create/${repoId}`, { 
        title, 
        description, 
        priority,
        labels: labelsArray
      });
      setTitle("");
      setDescription("");
      setPriority("medium");
      setLabels("");
      if (onCreated) onCreated();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to create issue. Only repo owner can create.");
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

  return (
    <Box as="form" onSubmit={handleSubmit} sx={{ 
      display: "grid", 
      gap: 12, 
      marginBottom: 20,
      padding: 16,
      backgroundColor: '#0d1117',
      border: '1px solid #30363d',
      borderRadius: 8
    }}>
      <div style={{ marginBottom: '8px' }}>
        <h3 style={{ margin: '0 0 12px 0', color: '#c9d1d9', fontSize: '16px' }}>Create New Issue</h3>
      </div>
      
      <TextInput
        aria-label="Issue title"
        placeholder="Issue title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ fontSize: 14 }}
      />
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: '#8b949e' }}>Priority</label>
          <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <Select.Option value="low">Low</Select.Option>
            <Select.Option value="medium">Medium</Select.Option>
            <Select.Option value="high">High</Select.Option>
          </Select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: '#8b949e' }}>Labels (comma-separated)</label>
          <TextInput
            placeholder="bug, enhancement, ui"
            value={labels}
            onChange={(e) => setLabels(e.target.value)}
            sx={{ fontSize: 12 }}
          />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: '#8b949e' }}>Common Labels</label>
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
      
      <textarea
        placeholder="Describe the issue in detail..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{
          background: "transparent",
          border: "1px solid #30363d",
          color: "#c9d1d9",
          padding: 12,
          borderRadius: 6,
          minHeight: 100,
          fontSize: 14,
          fontFamily: 'inherit',
          resize: 'vertical'
        }}
      />
      
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button type="submit" disabled={submitting} variant="primary">
          {submitting ? "Creating..." : "Create Issue"}
        </Button>
      </div>
    </Box>
  );
};

export default IssueForm;

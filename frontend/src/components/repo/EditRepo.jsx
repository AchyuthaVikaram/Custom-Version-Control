import React, { useState, useEffect } from "react";
import { Box, Button, TextInput, Select } from "@primer/react";
import { FaTimes, FaSave } from "react-icons/fa";
import api from "../../api";
import BASE_URL from "../../constant";

const EditRepo = ({ repo, onClose, onUpdated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [language, setLanguage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const languages = [
    'JavaScript', 'Python', 'Java', 'TypeScript', 'C++', 'C#', 'PHP', 
    'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'Dart', 'HTML', 'CSS', 
    'Shell', 'Vue', 'React', 'Angular'
  ];

  useEffect(() => {
    if (repo) {
      setName(repo.name || "");
      setDescription(repo.description || "");
      setVisibility(repo.visibility || true);
      setLanguage(repo.language || "");
    }
  }, [repo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Repository name is required");
    
    try {
      setSubmitting(true);
      await api.put(`${BASE_URL}/repo/update/${repo._id}`, {
        name: name.trim(),
        description: description.trim(),
        visibility,
        language
      });
      
      if (onUpdated) onUpdated();
      if (onClose) onClose();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to update repository");
    } finally {
      setSubmitting(false);
    }
  };

  if (!repo) return null;

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
        maxWidth: '500px',
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
            Edit Repository
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
              Repository Name *
            </label>
            <TextInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="my-awesome-repo"
              sx={{ width: '100%' }}
            />
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
              placeholder="A brief description of your repository..."
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '8px 12px',
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '14px', 
                color: '#c9d1d9',
                fontWeight: '600'
              }}>
                Visibility
              </label>
              <Select 
                value={visibility ? 'public' : 'private'} 
                onChange={(e) => setVisibility(e.target.value === 'public')}
              >
                <Select.Option value="public">Public</Select.Option>
                <Select.Option value="private">Private</Select.Option>
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
                Primary Language
              </label>
              <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <Select.Option value="">Select Language</Select.Option>
                {languages.map(lang => (
                  <Select.Option key={lang} value={lang}>{lang}</Select.Option>
                ))}
              </Select>
            </div>
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

export default EditRepo;

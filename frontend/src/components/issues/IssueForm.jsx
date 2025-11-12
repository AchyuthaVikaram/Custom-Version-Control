import React, { useState } from "react";
import { Box, Button, TextInput } from "@primer/react";
import api from "../../api";
import BASE_URL from "../../constant";

const IssueForm = ({ repoId, onCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Title is required");
    try {
      setSubmitting(true);
      await api.post(`${BASE_URL}/issue/create/${repoId}`, { title, description });
      setTitle("");
      setDescription("");
      if (onCreated) onCreated();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to create issue. Only repo owner can create.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 8, marginBottom: 16 }}>
      <TextInput
        aria-label="Issue title"
        placeholder="Issue title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Describe the issue..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{
          background: "transparent",
          border: "1px solid #30363d",
          color: "#c9d1d9",
          padding: 8,
          borderRadius: 6,
          minHeight: 80,
        }}
      />
      <div>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create Issue"}
        </Button>
      </div>
    </Box>
  );
};

export default IssueForm;

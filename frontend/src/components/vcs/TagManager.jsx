import React, { useState, useEffect } from "react";
import { FaTag, FaPlus, FaTrash, FaInfoCircle } from "react-icons/fa";
import api from "../../api";
import BASE_URL from "../../constant";
import "./vcs.css";

export default function TagManager({ repoId }) {
	const [tags, setTags] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [newTag, setNewTag] = useState({ name: "", message: "" });
	const [selectedTag, setSelectedTag] = useState(null);

	useEffect(() => {
		fetchTags();
	}, [repoId]);

	const fetchTags = async () => {
		try {
			const res = await api.get(`${BASE_URL}/vcs/tags/${repoId}`);
			setTags(res.data.tags);
		} catch (error) {
			console.error("Error fetching tags:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleCreateTag = async (e) => {
		e.preventDefault();
		if (!newTag.name.trim()) return;

		try {
			await api.post(`${BASE_URL}/vcs/tag/create`, {
				repoId,
				tagName: newTag.name,
				message: newTag.message,
			});
			setNewTag({ name: "", message: "" });
			setShowCreateForm(false);
			fetchTags();
		} catch (error) {
			alert(error?.response?.data?.message || "Error creating tag");
		}
	};

	const handleDeleteTag = async (tagName) => {
		if (!window.confirm(`Delete tag '${tagName}'?`)) return;

		try {
			await api.delete(`${BASE_URL}/vcs/tag/delete`, {
				data: { repoId, tagName },
			});
			fetchTags();
			if (selectedTag?.name === tagName) {
				setSelectedTag(null);
			}
		} catch (error) {
			alert(error?.response?.data?.message || "Error deleting tag");
		}
	};

	const fetchTagDetails = async (tagName) => {
		try {
			const res = await api.get(`${BASE_URL}/vcs/tag/${repoId}/${tagName}`);
			setSelectedTag(res.data);
		} catch (error) {
			console.error("Error fetching tag details:", error);
		}
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleString();
	};

	if (loading) return <div className="loading">Loading tags...</div>;

	return (
		<div className="tag-manager">
			<div className="tag-header">
				<h3>
					<FaTag /> Tags
				</h3>
				<button
					className="btn-create-tag"
					onClick={() => setShowCreateForm(!showCreateForm)}
				>
					<FaPlus /> New Tag
				</button>
			</div>

			{showCreateForm && (
				<form onSubmit={handleCreateTag} className="create-tag-form">
					<input
						type="text"
						placeholder="Tag name (e.g., v1.0.0)"
						value={newTag.name}
						onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
						autoFocus
					/>
					<textarea
						placeholder="Tag message (optional)"
						value={newTag.message}
						onChange={(e) => setNewTag({ ...newTag, message: e.target.value })}
						rows={3}
					/>
					<div className="form-actions">
						<button type="submit" className="btn-submit">
							Create Tag
						</button>
						<button
							type="button"
							className="btn-cancel"
							onClick={() => setShowCreateForm(false)}
						>
							Cancel
						</button>
					</div>
				</form>
			)}

			{tags.length === 0 ? (
				<p className="no-tags">No tags yet</p>
			) : (
				<div className="tags-container">
					<div className="tags-list">
						{tags.map((tag) => (
							<div
								key={tag.name}
								className={`tag-item ${
									selectedTag?.name === tag.name ? "selected" : ""
								}`}
							>
								<div
									className="tag-info"
									onClick={() => fetchTagDetails(tag.name)}
								>
									<FaTag className="tag-icon" />
									<div className="tag-details">
										<span className="tag-name">{tag.name}</span>
										<span className="tag-commit">
											{tag.commit.substring(0, 7)}
										</span>
										<span className="tag-date">{formatDate(tag.created)}</span>
									</div>
								</div>
								<button
									className="btn-delete-tag"
									onClick={() => handleDeleteTag(tag.name)}
								>
									<FaTrash />
								</button>
							</div>
						))}
					</div>

					{selectedTag && (
						<div className="tag-details-panel">
							<h4>
								<FaInfoCircle /> Tag Details
							</h4>
							<div className="detail-section">
								<strong>Name:</strong> {selectedTag.name}
							</div>
							<div className="detail-section">
								<strong>Commit:</strong> {selectedTag.commit}
							</div>
							<div className="detail-section">
								<strong>Created:</strong> {formatDate(selectedTag.created)}
							</div>
							{selectedTag.message && (
								<div className="detail-section">
									<strong>Message:</strong>
									<p>{selectedTag.message}</p>
								</div>
							)}
							{selectedTag.commitDetails && (
								<div className="detail-section">
									<strong>Commit Message:</strong>
									<p>{selectedTag.commitDetails.message}</p>
								</div>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

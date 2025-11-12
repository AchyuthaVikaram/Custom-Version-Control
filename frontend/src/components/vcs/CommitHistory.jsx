import React, { useState, useEffect } from "react";
import { FaHistory, FaUser, FaClock, FaCodeBranch } from "react-icons/fa";
import api from "../../api";
import BASE_URL from "../../constant";
import "./vcs.css";

export default function CommitHistory({ repoId }) {
	const [commits, setCommits] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedCommit, setSelectedCommit] = useState(null);
	const [limit, setLimit] = useState(20);

	useEffect(() => {
		fetchCommits();
	}, [repoId, limit]);

	const fetchCommits = async () => {
		try {
			const res = await api.get(`${BASE_URL}/vcs/commits/${repoId}?limit=${limit}`);
			setCommits(res.data.commits);
		} catch (error) {
			console.error("Error fetching commits:", error);
		} finally {
			setLoading(false);
		}
	};

	const fetchCommitDetails = async (commitId) => {
		try {
			const res = await api.get(`${BASE_URL}/vcs/commit/${repoId}/${commitId}`);
			setSelectedCommit(res.data);
		} catch (error) {
			console.error("Error fetching commit details:", error);
		}
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleString();
	};

	if (loading) return <div className="loading">Loading commit history...</div>;

	return (
		<div className="commit-history">
			<div className="history-header">
				<h3>
					<FaHistory /> Commit History
				</h3>
				<select
					value={limit}
					onChange={(e) => setLimit(Number(e.target.value))}
					className="limit-select"
				>
					<option value={10}>Last 10</option>
					<option value={20}>Last 20</option>
					<option value={50}>Last 50</option>
					<option value={100}>Last 100</option>
				</select>
			</div>

			{commits.length === 0 ? (
				<p className="no-commits">No commits yet</p>
			) : (
				<div className="commits-container">
					<div className="commits-list">
						{commits.map((commit) => (
							<div
								key={commit.id}
								className={`commit-item ${
									selectedCommit?.id === commit.id ? "selected" : ""
								}`}
								onClick={() => fetchCommitDetails(commit.id)}
							>
								<div className="commit-header">
									<span className="commit-id">{commit.id.substring(0, 7)}</span>
									{commit.branch && (
										<span className="commit-branch">
											<FaCodeBranch /> {commit.branch}
										</span>
									)}
								</div>
								<p className="commit-message">{commit.message}</p>
								<div className="commit-meta">
									<span className="commit-author">
										<FaUser /> {commit.author}
									</span>
									<span className="commit-date">
										<FaClock /> {formatDate(commit.date)}
									</span>
								</div>
							</div>
						))}
					</div>

					{selectedCommit && (
						<div className="commit-details">
							<h4>Commit Details</h4>
							<div className="detail-section">
								<strong>ID:</strong> {selectedCommit.id}
							</div>
							<div className="detail-section">
								<strong>Message:</strong> {selectedCommit.message}
							</div>
							<div className="detail-section">
								<strong>Author:</strong> {selectedCommit.author}
							</div>
							<div className="detail-section">
								<strong>Date:</strong> {formatDate(selectedCommit.date)}
							</div>
							{selectedCommit.branch && (
								<div className="detail-section">
									<strong>Branch:</strong> {selectedCommit.branch}
								</div>
							)}
							{selectedCommit.parent && (
								<div className="detail-section">
									<strong>Parent:</strong> {selectedCommit.parent.substring(0, 7)}
								</div>
							)}
							{selectedCommit.files && selectedCommit.files.length > 0 && (
								<div className="detail-section">
									<strong>Files ({selectedCommit.files.length}):</strong>
									<ul className="file-list">
										{selectedCommit.files.map((file) => (
											<li key={file}>{file}</li>
										))}
									</ul>
								</div>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

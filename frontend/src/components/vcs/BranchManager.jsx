import React, { useState, useEffect } from "react";
import { FaCodeBranch, FaPlus, FaTrash, FaCheck } from "react-icons/fa";
import api from "../../api";
import BASE_URL from "../../constant";
import "./vcs.css";

export default function BranchManager({ repoId }) {
	const [branches, setBranches] = useState([]);
	const [currentBranch, setCurrentBranch] = useState("");
	const [newBranchName, setNewBranchName] = useState("");
	const [loading, setLoading] = useState(true);
	const [showCreateForm, setShowCreateForm] = useState(false);

	useEffect(() => {
		fetchBranches();
	}, [repoId]);

	const fetchBranches = async () => {
		try {
			const res = await api.get(`${BASE_URL}/vcs/branch/list/${repoId}`);
			setBranches(res.data.branches);
			setCurrentBranch(res.data.currentBranch);
		} catch (error) {
			console.error("Error fetching branches:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleCreateBranch = async (e) => {
		e.preventDefault();
		if (!newBranchName.trim()) return;

		try {
			await api.post(`${BASE_URL}/vcs/branch/create`, {
				repoId,
				branchName: newBranchName,
			});
			setNewBranchName("");
			setShowCreateForm(false);
			fetchBranches();
		} catch (error) {
			alert(error?.response?.data?.message || "Error creating branch");
		}
	};

	const handleSwitchBranch = async (branchName) => {
		if (branchName === currentBranch) return;

		try {
			await api.post(`${BASE_URL}/vcs/branch/switch`, {
				repoId,
				branchName,
			});
			setCurrentBranch(branchName);
			fetchBranches();
		} catch (error) {
			alert(error?.response?.data?.message || "Error switching branch");
		}
	};

	const handleDeleteBranch = async (branchName) => {
		if (branchName === currentBranch) {
			alert("Cannot delete current branch");
			return;
		}

		if (!window.confirm(`Delete branch '${branchName}'?`)) return;

		try {
			await api.delete(`${BASE_URL}/vcs/branch/delete`, {
				data: { repoId, branchName },
			});
			fetchBranches();
		} catch (error) {
			alert(error?.response?.data?.message || "Error deleting branch");
		}
	};

	if (loading) return <div className="loading">Loading branches...</div>;

	return (
		<div className="branch-manager">
			<div className="branch-header">
				<h3>
					<FaCodeBranch /> Branches
				</h3>
				<button
					className="btn-create-branch"
					onClick={() => setShowCreateForm(!showCreateForm)}
				>
					<FaPlus /> New Branch
				</button>
			</div>

			{showCreateForm && (
				<form onSubmit={handleCreateBranch} className="create-branch-form">
					<input
						type="text"
						placeholder="Branch name"
						value={newBranchName}
						onChange={(e) => setNewBranchName(e.target.value)}
						autoFocus
					/>
					<button type="submit" className="btn-submit">
						Create
					</button>
					<button
						type="button"
						className="btn-cancel"
						onClick={() => setShowCreateForm(false)}
					>
						Cancel
					</button>
				</form>
			)}

			<div className="branch-list">
				{branches.map((branch) => (
					<div
						key={branch.name}
						className={`branch-item ${branch.current ? "current" : ""}`}
					>
						<div className="branch-info">
							{branch.current && <FaCheck className="current-icon" />}
							<span className="branch-name">{branch.name}</span>
							{branch.commit && (
								<span className="commit-id">
									{branch.commit.substring(0, 7)}
								</span>
							)}
						</div>
						<div className="branch-actions">
							{!branch.current && (
								<>
									<button
										className="btn-switch"
										onClick={() => handleSwitchBranch(branch.name)}
									>
										Switch
									</button>
									<button
										className="btn-delete"
										onClick={() => handleDeleteBranch(branch.name)}
									>
										<FaTrash />
									</button>
								</>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

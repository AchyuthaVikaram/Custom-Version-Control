const fs = require("fs").promises;
const path = require("path");
const Repository = require("../models/repoModel");

// Helper function to get repository path
const getRepoPath = (repoId) => {
	return path.resolve(process.cwd(), "repositories", repoId, ".customGit");
};

// Branch operations
exports.createBranch = async (req, res) => {
	try {
		const { repoId, branchName } = req.body;
		const repoPath = getRepoPath(repoId);
		const branchesPath = path.join(repoPath, "refs", "heads");
		const headPath = path.join(repoPath, "HEAD");

		await fs.mkdir(branchesPath, { recursive: true });

		let currentCommit = null;
		try {
			const headContent = await fs.readFile(headPath, "utf-8");
			const headData = JSON.parse(headContent);
			currentCommit = headData.commit;
		} catch (error) {
			currentCommit = null;
		}

		const branchPath = path.join(branchesPath, branchName);
		await fs.writeFile(
			branchPath,
			JSON.stringify({ commit: currentCommit, created: new Date().toISOString() })
		);

		res.status(201).json({ message: `Branch '${branchName}' created successfully` });
	} catch (error) {
		res.status(500).json({ message: "Error creating branch", error: error.message });
	}
};

exports.switchBranch = async (req, res) => {
	try {
		const { repoId, branchName } = req.body;
		const repoPath = getRepoPath(repoId);
		const branchPath = path.join(repoPath, "refs", "heads", branchName);
		const headPath = path.join(repoPath, "HEAD");

		const branchContent = await fs.readFile(branchPath, "utf-8");
		const branchData = JSON.parse(branchContent);

		await fs.writeFile(
			headPath,
			JSON.stringify({
				branch: branchName,
				commit: branchData.commit,
				updated: new Date().toISOString(),
			})
		);

		res.json({ message: `Switched to branch '${branchName}'`, commit: branchData.commit });
	} catch (error) {
		res.status(500).json({ message: "Error switching branch", error: error.message });
	}
};

exports.listBranches = async (req, res) => {
	try {
		const { repoId } = req.params;
		const repoPath = getRepoPath(repoId);
		const branchesPath = path.join(repoPath, "refs", "heads");
		const headPath = path.join(repoPath, "HEAD");

		let currentBranch = "master";
		try {
			const headContent = await fs.readFile(headPath, "utf-8");
			const headData = JSON.parse(headContent);
			currentBranch = headData.branch || "master";
		} catch (error) {
			// Use default
		}

		const branches = await fs.readdir(branchesPath);
		const branchList = await Promise.all(
			branches.map(async (branch) => {
				const branchPath = path.join(branchesPath, branch);
				const branchContent = await fs.readFile(branchPath, "utf-8");
				const branchData = JSON.parse(branchContent);
				return {
					name: branch,
					current: branch === currentBranch,
					commit: branchData.commit,
					created: branchData.created,
				};
			})
		);

		res.json({ branches: branchList, currentBranch });
	} catch (error) {
		res.status(500).json({ message: "Error listing branches", error: error.message });
	}
};

exports.deleteBranch = async (req, res) => {
	try {
		const { repoId, branchName } = req.body;
		const repoPath = getRepoPath(repoId);
		const branchPath = path.join(repoPath, "refs", "heads", branchName);
		const headPath = path.join(repoPath, "HEAD");

		const headContent = await fs.readFile(headPath, "utf-8");
		const headData = JSON.parse(headContent);

		if (headData.branch === branchName) {
			return res.status(400).json({ message: "Cannot delete current branch" });
		}

		await fs.unlink(branchPath);
		res.json({ message: `Branch '${branchName}' deleted successfully` });
	} catch (error) {
		res.status(500).json({ message: "Error deleting branch", error: error.message });
	}
};

exports.getCurrentBranch = async (req, res) => {
	try {
		const { repoId } = req.params;
		const repoPath = getRepoPath(repoId);
		const headPath = path.join(repoPath, "HEAD");

		const headContent = await fs.readFile(headPath, "utf-8");
		const headData = JSON.parse(headContent);

		res.json({ branch: headData.branch || "master", commit: headData.commit });
	} catch (error) {
		res.status(500).json({ message: "Error getting current branch", error: error.message });
	}
};

// Commit operations
exports.getCommits = async (req, res) => {
	try {
		const { repoId } = req.params;
		const { limit = 50 } = req.query;
		const repoPath = getRepoPath(repoId);
		const commitsPath = path.join(repoPath, "commits");

		const commitDirs = await fs.readdir(commitsPath);
		const commits = [];

		for (const commitId of commitDirs) {
			const commitJsonPath = path.join(commitsPath, commitId, "commit.json");
			try {
				const commitData = await fs.readFile(commitJsonPath, "utf-8");
				const commit = JSON.parse(commitData);
				commits.push({
					id: commitId,
					message: commit.message,
					date: commit.date,
					author: commit.author || "Unknown",
					branch: commit.branch,
					parent: commit.parent,
				});
			} catch (error) {
				// Skip invalid commits
			}
		}

		commits.sort((a, b) => new Date(b.date) - new Date(a.date));
		const limitedCommits = commits.slice(0, parseInt(limit));

		res.json({ commits: limitedCommits, total: commits.length });
	} catch (error) {
		res.status(500).json({ message: "Error fetching commits", error: error.message });
	}
};

exports.getCommitDetails = async (req, res) => {
	try {
		const { repoId, commitId } = req.params;
		const repoPath = getRepoPath(repoId);
		const commitPath = path.join(repoPath, "commits", commitId);
		const commitJsonPath = path.join(commitPath, "commit.json");

		const commitData = await fs.readFile(commitJsonPath, "utf-8");
		const commit = JSON.parse(commitData);

		const files = await fs.readdir(commitPath);
		const fileList = files.filter((f) => f !== "commit.json");

		res.json({
			id: commitId,
			...commit,
			files: fileList,
		});
	} catch (error) {
		res.status(500).json({ message: "Error fetching commit details", error: error.message });
	}
};

exports.createCommit = async (req, res) => {
	try {
		const { repoId, message } = req.body;
		// This would integrate with the actual commit controller
		// For now, return a placeholder
		res.json({ message: "Commit functionality to be integrated with file upload" });
	} catch (error) {
		res.status(500).json({ message: "Error creating commit", error: error.message });
	}
};

// Status and diff
exports.getStatus = async (req, res) => {
	try {
		const { repoId } = req.params;
		const repoPath = getRepoPath(repoId);
		const stagingPath = path.join(repoPath, "staging");
		const headPath = path.join(repoPath, "HEAD");

		let currentBranch = "master";
		let headCommit = null;
		try {
			const headContent = await fs.readFile(headPath, "utf-8");
			const headData = JSON.parse(headContent);
			currentBranch = headData.branch || "master";
			headCommit = headData.commit;
		} catch (error) {
			// Use defaults
		}

		let stagedFiles = [];
		try {
			stagedFiles = await fs.readdir(stagingPath);
		} catch (error) {
			// No staged files
		}

		res.json({
			branch: currentBranch,
			commit: headCommit,
			stagedFiles,
			hasChanges: stagedFiles.length > 0,
		});
	} catch (error) {
		res.status(500).json({ message: "Error getting status", error: error.message });
	}
};

exports.getDiff = async (req, res) => {
	try {
		const { repoId } = req.params;
		// Placeholder for diff implementation
		res.json({ message: "Diff functionality to be implemented" });
	} catch (error) {
		res.status(500).json({ message: "Error getting diff", error: error.message });
	}
};

exports.getFileDiff = async (req, res) => {
	try {
		const { repoId, filename } = req.params;
		// Placeholder for file diff implementation
		res.json({ message: "File diff functionality to be implemented" });
	} catch (error) {
		res.status(500).json({ message: "Error getting file diff", error: error.message });
	}
};

// Merge operations
exports.mergeBranch = async (req, res) => {
	try {
		const { repoId, sourceBranch } = req.body;
		// Placeholder for merge implementation
		res.json({ message: "Merge functionality to be implemented" });
	} catch (error) {
		res.status(500).json({ message: "Error merging branch", error: error.message });
	}
};

exports.abortMerge = async (req, res) => {
	try {
		const { repoId } = req.body;
		// Placeholder for merge abort implementation
		res.json({ message: "Merge abort functionality to be implemented" });
	} catch (error) {
		res.status(500).json({ message: "Error aborting merge", error: error.message });
	}
};

// Tag operations
exports.createTag = async (req, res) => {
	try {
		const { repoId, tagName, commitId, message } = req.body;
		const repoPath = getRepoPath(repoId);
		const tagsPath = path.join(repoPath, "refs", "tags");
		const headPath = path.join(repoPath, "HEAD");

		await fs.mkdir(tagsPath, { recursive: true });

		let targetCommit = commitId;
		if (!targetCommit) {
			const headContent = await fs.readFile(headPath, "utf-8");
			const headData = JSON.parse(headContent);
			targetCommit = headData.commit;
		}

		if (!targetCommit) {
			return res.status(400).json({ message: "No commit to tag" });
		}

		const tagPath = path.join(tagsPath, tagName);
		await fs.writeFile(
			tagPath,
			JSON.stringify({
				commit: targetCommit,
				message: message || `Tag ${tagName}`,
				created: new Date().toISOString(),
			})
		);

		res.status(201).json({ message: `Tag '${tagName}' created successfully` });
	} catch (error) {
		res.status(500).json({ message: "Error creating tag", error: error.message });
	}
};

exports.listTags = async (req, res) => {
	try {
		const { repoId } = req.params;
		const repoPath = getRepoPath(repoId);
		const tagsPath = path.join(repoPath, "refs", "tags");

		const tags = await fs.readdir(tagsPath);
		const tagList = await Promise.all(
			tags.map(async (tagName) => {
				const tagPath = path.join(tagsPath, tagName);
				const tagContent = await fs.readFile(tagPath, "utf-8");
				const tagData = JSON.parse(tagContent);
				return {
					name: tagName,
					commit: tagData.commit,
					message: tagData.message,
					created: tagData.created,
				};
			})
		);

		res.json({ tags: tagList });
	} catch (error) {
		if (error.code === "ENOENT") {
			res.json({ tags: [] });
		} else {
			res.status(500).json({ message: "Error listing tags", error: error.message });
		}
	}
};

exports.deleteTag = async (req, res) => {
	try {
		const { repoId, tagName } = req.body;
		const repoPath = getRepoPath(repoId);
		const tagPath = path.join(repoPath, "refs", "tags", tagName);

		await fs.unlink(tagPath);
		res.json({ message: `Tag '${tagName}' deleted successfully` });
	} catch (error) {
		res.status(500).json({ message: "Error deleting tag", error: error.message });
	}
};

exports.getTagDetails = async (req, res) => {
	try {
		const { repoId, tagName } = req.params;
		const repoPath = getRepoPath(repoId);
		const tagPath = path.join(repoPath, "refs", "tags", tagName);

		const tagContent = await fs.readFile(tagPath, "utf-8");
		const tagData = JSON.parse(tagContent);

		const commitPath = path.join(repoPath, "commits", tagData.commit, "commit.json");
		let commitData = null;
		try {
			const commitContent = await fs.readFile(commitPath, "utf-8");
			commitData = JSON.parse(commitContent);
		} catch (error) {
			// Commit not found
		}

		res.json({
			name: tagName,
			...tagData,
			commitDetails: commitData,
		});
	} catch (error) {
		res.status(500).json({ message: "Error getting tag details", error: error.message });
	}
};

// Stash operations
exports.stashChanges = async (req, res) => {
	try {
		const { repoId, message } = req.body;
		// Placeholder for stash implementation
		res.json({ message: "Stash functionality to be implemented" });
	} catch (error) {
		res.status(500).json({ message: "Error stashing changes", error: error.message });
	}
};

exports.listStashes = async (req, res) => {
	try {
		const { repoId } = req.params;
		const repoPath = getRepoPath(repoId);
		const stashPath = path.join(repoPath, "stash");

		const stashes = await fs.readdir(stashPath);
		const stashList = await Promise.all(
			stashes.map(async (stashId, index) => {
				const stashJsonPath = path.join(stashPath, stashId, "stash.json");
				try {
					const stashData = await fs.readFile(stashJsonPath, "utf-8");
					const stash = JSON.parse(stashData);
					return {
						id: stashId,
						index,
						message: stash.message,
						date: stash.date,
						commit: stash.commit,
					};
				} catch (error) {
					return null;
				}
			})
		);

		res.json({ stashes: stashList.filter((s) => s !== null) });
	} catch (error) {
		if (error.code === "ENOENT") {
			res.json({ stashes: [] });
		} else {
			res.status(500).json({ message: "Error listing stashes", error: error.message });
		}
	}
};

exports.applyStash = async (req, res) => {
	try {
		const { repoId, index } = req.body;
		// Placeholder for stash apply implementation
		res.json({ message: "Stash apply functionality to be implemented" });
	} catch (error) {
		res.status(500).json({ message: "Error applying stash", error: error.message });
	}
};

exports.popStash = async (req, res) => {
	try {
		const { repoId, index } = req.body;
		// Placeholder for stash pop implementation
		res.json({ message: "Stash pop functionality to be implemented" });
	} catch (error) {
		res.status(500).json({ message: "Error popping stash", error: error.message });
	}
};

exports.clearStashes = async (req, res) => {
	try {
		const { repoId } = req.params;
		const repoPath = getRepoPath(repoId);
		const stashPath = path.join(repoPath, "stash");

		await fs.rm(stashPath, { recursive: true, force: true });
		await fs.mkdir(stashPath, { recursive: true });

		res.json({ message: "All stashes cleared successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error clearing stashes", error: error.message });
	}
};

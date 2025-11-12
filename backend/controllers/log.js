const fs = require("fs").promises;
const path = require("path");
const { getCurrentBranch } = require("./branch");

/**
 * Display commit history
 * @param {number} limit - Number of commits to display (default: all)
 */
async function log(limit = null) {
	const repoPath = path.resolve(process.cwd(), ".customGit");
	const commitsPath = path.join(repoPath, "commits");

	try {
		// Get current branch
		const currentBranch = await getCurrentBranch();

		// Get all commit directories
		const commitDirs = await fs.readdir(commitsPath);

		if (commitDirs.length === 0) {
			console.log("No commits yet");
			return;
		}

		// Read commit metadata and sort by date
		const commits = [];
		for (const commitId of commitDirs) {
			const commitJsonPath = path.join(commitsPath, commitId, "commit.json");
			try {
				const commitData = await fs.readFile(commitJsonPath, "utf-8");
				const commit = JSON.parse(commitData);
				commits.push({
					id: commitId,
					message: commit.message,
					date: new Date(commit.date),
					author: commit.author || "Unknown",
					branch: commit.branch || currentBranch,
				});
			} catch (error) {
				// Skip commits without metadata
			}
		}

		// Sort commits by date (newest first)
		commits.sort((a, b) => b.date - a.date);

		// Apply limit if specified
		const displayCommits = limit ? commits.slice(0, limit) : commits;

		// Display commits
		console.log(`Commit history for branch '${currentBranch}':\n`);
		for (const commit of displayCommits) {
			console.log(`commit ${commit.id}`);
			console.log(`Author: ${commit.author}`);
			console.log(`Date:   ${commit.date.toLocaleString()}`);
			console.log(`\n    ${commit.message}\n`);
		}

		if (limit && commits.length > limit) {
			console.log(`... and ${commits.length - limit} more commits`);
		}
	} catch (error) {
		if (error.code === "ENOENT") {
			console.log("No commits found. Initialize repository first.");
		} else {
			console.error("Error reading commit history:", error);
		}
	}
}

/**
 * Display commit history in one-line format
 */
async function logOneline() {
	const repoPath = path.resolve(process.cwd(), ".customGit");
	const commitsPath = path.join(repoPath, "commits");

	try {
		const commitDirs = await fs.readdir(commitsPath);

		if (commitDirs.length === 0) {
			console.log("No commits yet");
			return;
		}

		const commits = [];
		for (const commitId of commitDirs) {
			const commitJsonPath = path.join(commitsPath, commitId, "commit.json");
			try {
				const commitData = await fs.readFile(commitJsonPath, "utf-8");
				const commit = JSON.parse(commitData);
				commits.push({
					id: commitId,
					message: commit.message,
					date: new Date(commit.date),
				});
			} catch (error) {
				// Skip commits without metadata
			}
		}

		commits.sort((a, b) => b.date - a.date);

		for (const commit of commits) {
			const shortId = commit.id.substring(0, 7);
			console.log(`${shortId} ${commit.message}`);
		}
	} catch (error) {
		console.error("Error reading commit history:", error);
	}
}

module.exports = { log, logOneline };

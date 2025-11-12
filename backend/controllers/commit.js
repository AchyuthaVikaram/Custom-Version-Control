const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid"); // Generates a unique commit ID to track each commit

async function commit(message) {
	// Define paths for repository, staging area, and commit storage
	const repoPath = path.resolve(process.cwd(), ".customGit"); // Locate the repository in the current working directory
	const stagedPath = path.join(repoPath, "staging"); // Path where staged files are temporarily stored before committing
	const commitPath = path.join(repoPath, "commits"); // Path where committed changes are permanently stored
	const headPath = path.join(repoPath, "HEAD");

	try {
		// Get current branch
		let currentBranch = "master";
		let parentCommit = null;
		try {
			const headContent = await fs.readFile(headPath, "utf-8");
			const headData = JSON.parse(headContent);
			currentBranch = headData.branch || "master";
			parentCommit = headData.commit;
		} catch (error) {
			// HEAD doesn't exist, use defaults
		}

		// Generate a unique commit ID for this commit
		const commitId = uuidv4();
		// The commit ID ensures that each commit is uniquely identifiable.
		// This allows rollback to specific versions and prevents overwriting previous commits.

		// Create a new folder inside "commits" with the commit ID
		const commitDir = path.join(commitPath, commitId);
		await fs.mkdir(commitDir, { recursive: true });
		// This directory will store all files associated with this commit.
		// Using "recursive: true" ensures that parent folders are created if they don't exist.

		// Read all files from the staging area
		const files = await fs.readdir(stagedPath);
		// The staging area holds files that the user wants to commit.
		// Without this step, there would be no way to track which files need to be included in the commit.

		if (files.length === 0) {
			console.log("Nothing to commit. Stage files using 'add' command first.");
			return;
		}

		// Copy each staged file to the new commit directory
		for (const file of files) {
			await fs.copyFile(
				path.join(stagedPath, file),
				path.join(commitDir, file)
			);
			// This step ensures that all changes are safely stored under the commit ID.
			// Without copying, the commit would have no record of what changed.
		}

		// Save commit metadata (message, timestamp, branch, and parent) in a JSON file
		await fs.writeFile(
			path.join(commitDir, "commit.json"),
			JSON.stringify({ 
				message, 
				date: new Date().toISOString(),
				branch: currentBranch,
				parent: parentCommit,
				author: process.env.USER || process.env.USERNAME || "Unknown"
			})
		);
		// This file acts as a log entry for the commit, storing the message and timestamp.
		// Without it, we wouldn't know what changes were made or when they occurred.

		// Update HEAD to point to new commit
		await fs.writeFile(
			headPath,
			JSON.stringify({
				branch: currentBranch,
				commit: commitId,
				updated: new Date().toISOString()
			})
		);

		// Update current branch to point to new commit
		const branchPath = path.join(repoPath, "refs", "heads", currentBranch);
		await fs.writeFile(
			branchPath,
			JSON.stringify({
				commit: commitId,
				updated: new Date().toISOString()
			})
		);

		// Clear staging area
		for (const file of files) {
			await fs.unlink(path.join(stagedPath, file));
		}

		console.log(`[${currentBranch} ${commitId.substring(0, 7)}] ${message}`);
		console.log(`${files.length} file(s) changed`);
	} catch (error) {
		console.log("Error in committing changes: " + error);
	}
}

module.exports = { commit };

const fs = require("fs").promises;
const path = require("path");

/**
 * Create a new branch
 * @param {string} branchName - Name of the branch to create
 */
async function createBranch(branchName) {
	const repoPath = path.resolve(process.cwd(), ".customGit");
	const branchesPath = path.join(repoPath, "refs", "heads");
	const headPath = path.join(repoPath, "HEAD");

	try {
		// Create branches directory if it doesn't exist
		await fs.mkdir(branchesPath, { recursive: true });

		// Get current commit ID from HEAD
		let currentCommit = null;
		try {
			const headContent = await fs.readFile(headPath, "utf-8");
			const headData = JSON.parse(headContent);
			currentCommit = headData.commit;
		} catch (error) {
			// If HEAD doesn't exist or has no commit, use null (initial state)
			currentCommit = null;
		}

		// Create branch file with current commit reference
		const branchPath = path.join(branchesPath, branchName);
		await fs.writeFile(
			branchPath,
			JSON.stringify({ commit: currentCommit, created: new Date().toISOString() })
		);

		console.log(`Branch '${branchName}' created successfully`);
	} catch (error) {
		console.error("Error creating branch:", error);
	}
}

/**
 * Switch to a different branch
 * @param {string} branchName - Name of the branch to switch to
 */
async function switchBranch(branchName) {
	const repoPath = path.resolve(process.cwd(), ".customGit");
	const branchPath = path.join(repoPath, "refs", "heads", branchName);
	const headPath = path.join(repoPath, "HEAD");

	try {
		// Check if branch exists
		const branchContent = await fs.readFile(branchPath, "utf-8");
		const branchData = JSON.parse(branchContent);

		// Update HEAD to point to the new branch
		await fs.writeFile(
			headPath,
			JSON.stringify({
				branch: branchName,
				commit: branchData.commit,
				updated: new Date().toISOString(),
			})
		);

		// If branch has a commit, restore working directory to that commit
		if (branchData.commit) {
			const commitPath = path.join(repoPath, "commits", branchData.commit);
			const files = await fs.readdir(commitPath);
			const parentDir = path.resolve(repoPath, "..");

			for (const file of files) {
				if (file !== "commit.json") {
					await fs.copyFile(
						path.join(commitPath, file),
						path.join(parentDir, file)
					);
				}
			}
		}

		console.log(`Switched to branch '${branchName}'`);
	} catch (error) {
		if (error.code === "ENOENT") {
			console.error(`Branch '${branchName}' does not exist`);
		} else {
			console.error("Error switching branch:", error);
		}
	}
}

/**
 * List all branches
 */
async function listBranches() {
	const repoPath = path.resolve(process.cwd(), ".customGit");
	const branchesPath = path.join(repoPath, "refs", "heads");
	const headPath = path.join(repoPath, "HEAD");

	try {
		// Get current branch from HEAD
		let currentBranch = "master";
		try {
			const headContent = await fs.readFile(headPath, "utf-8");
			const headData = JSON.parse(headContent);
			currentBranch = headData.branch || "master";
		} catch (error) {
			// HEAD doesn't exist, default to master
		}

		// List all branches
		const branches = await fs.readdir(branchesPath);

		console.log("Branches:");
		for (const branch of branches) {
			const marker = branch === currentBranch ? "* " : "  ";
			console.log(`${marker}${branch}`);
		}
	} catch (error) {
		if (error.code === "ENOENT") {
			console.log("No branches found. Initialize repository first.");
		} else {
			console.error("Error listing branches:", error);
		}
	}
}

/**
 * Delete a branch
 * @param {string} branchName - Name of the branch to delete
 */
async function deleteBranch(branchName) {
	const repoPath = path.resolve(process.cwd(), ".customGit");
	const branchPath = path.join(repoPath, "refs", "heads", branchName);
	const headPath = path.join(repoPath, "HEAD");

	try {
		// Check if trying to delete current branch
		const headContent = await fs.readFile(headPath, "utf-8");
		const headData = JSON.parse(headContent);
		
		if (headData.branch === branchName) {
			console.error(`Cannot delete branch '${branchName}': currently checked out`);
			return;
		}

		// Delete branch file
		await fs.unlink(branchPath);
		console.log(`Branch '${branchName}' deleted successfully`);
	} catch (error) {
		if (error.code === "ENOENT") {
			console.error(`Branch '${branchName}' does not exist`);
		} else {
			console.error("Error deleting branch:", error);
		}
	}
}

/**
 * Get current branch name
 */
async function getCurrentBranch() {
	const repoPath = path.resolve(process.cwd(), ".customGit");
	const headPath = path.join(repoPath, "HEAD");

	try {
		const headContent = await fs.readFile(headPath, "utf-8");
		const headData = JSON.parse(headContent);
		return headData.branch || "master";
	} catch (error) {
		return "master";
	}
}

module.exports = {
	createBranch,
	switchBranch,
	listBranches,
	deleteBranch,
	getCurrentBranch,
};

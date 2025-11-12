const fs = require("fs").promises;
const path = require("path");
const { getCurrentBranch } = require("./branch");

/**
 * Show the working directory status
 */
async function status() {
	const repoPath = path.resolve(process.cwd(), ".customGit");
	const stagingPath = path.join(repoPath, "staging");
	const headPath = path.join(repoPath, "HEAD");
	const workingDir = path.resolve(repoPath, "..");

	try {
		// Get current branch
		const currentBranch = await getCurrentBranch();
		console.log(`On branch ${currentBranch}\n`);

		// Get HEAD commit
		let headCommit = null;
		try {
			const headContent = await fs.readFile(headPath, "utf-8");
			const headData = JSON.parse(headContent);
			headCommit = headData.commit;
		} catch (error) {
			console.log("No commits yet\n");
		}

		// Get staged files
		let stagedFiles = [];
		try {
			stagedFiles = await fs.readdir(stagingPath);
		} catch (error) {
			// Staging directory doesn't exist
		}

		// Get all files in working directory (excluding .customGit)
		const allFiles = await fs.readdir(workingDir);
		const workingFiles = allFiles.filter(
			(file) => file !== ".customGit" && !file.startsWith(".")
		);

		// Get committed files from last commit
		let committedFiles = [];
		if (headCommit) {
			const commitPath = path.join(repoPath, "commits", headCommit);
			try {
				const commitFiles = await fs.readdir(commitPath);
				committedFiles = commitFiles.filter((file) => file !== "commit.json");
			} catch (error) {
				// Commit directory doesn't exist
			}
		}

		// Categorize files
		const modified = [];
		const untracked = [];
		const deleted = [];

		// Check for modified and deleted files
		for (const file of committedFiles) {
			if (!workingFiles.includes(file)) {
				deleted.push(file);
			} else {
				// Check if file is modified
				const workingFilePath = path.join(workingDir, file);
				const committedFilePath = path.join(
					repoPath,
					"commits",
					headCommit,
					file
				);

				try {
					const workingContent = await fs.readFile(workingFilePath);
					const committedContent = await fs.readFile(committedFilePath);

					if (!workingContent.equals(committedContent)) {
						modified.push(file);
					}
				} catch (error) {
					// Error reading file
				}
			}
		}

		// Check for untracked files
		for (const file of workingFiles) {
			if (!committedFiles.includes(file) && !stagedFiles.includes(file)) {
				untracked.push(file);
			}
		}

		// Display status
		if (stagedFiles.length > 0) {
			console.log("Changes to be committed:");
			console.log("  (use 'revert <commitID>' to unstage)\n");
			for (const file of stagedFiles) {
				console.log(`\tnew file:   ${file}`);
			}
			console.log();
		}

		if (modified.length > 0) {
			console.log("Changes not staged for commit:");
			console.log("  (use 'add <file>' to update what will be committed)\n");
			for (const file of modified) {
				console.log(`\tmodified:   ${file}`);
			}
			console.log();
		}

		if (deleted.length > 0) {
			console.log("Deleted files:");
			for (const file of deleted) {
				console.log(`\tdeleted:    ${file}`);
			}
			console.log();
		}

		if (untracked.length > 0) {
			console.log("Untracked files:");
			console.log("  (use 'add <file>' to include in what will be committed)\n");
			for (const file of untracked) {
				console.log(`\t${file}`);
			}
			console.log();
		}

		if (
			stagedFiles.length === 0 &&
			modified.length === 0 &&
			deleted.length === 0 &&
			untracked.length === 0
		) {
			console.log("nothing to commit, working tree clean");
		}
	} catch (error) {
		console.error("Error getting status:", error);
	}
}

module.exports = { status };

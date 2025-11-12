const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

/**
 * Stash current changes
 * @param {string} message - Optional stash message
 */
async function stash(message = null) {
	const repoPath = path.resolve(process.cwd(), ".customGit");
	const stashPath = path.join(repoPath, "stash");
	const workingDir = path.resolve(repoPath, "..");
	const headPath = path.join(repoPath, "HEAD");

	try {
		// Create stash directory if it doesn't exist
		await fs.mkdir(stashPath, { recursive: true });

		// Get current commit
		let currentCommit = null;
		try {
			const headContent = await fs.readFile(headPath, "utf-8");
			const headData = JSON.parse(headContent);
			currentCommit = headData.commit;
		} catch (error) {
			// No HEAD
		}

		// Get all modified files
		const allFiles = await fs.readdir(workingDir);
		const workingFiles = allFiles.filter(
			(file) => file !== ".customGit" && !file.startsWith(".")
		);

		if (workingFiles.length === 0) {
			console.log("No changes to stash");
			return;
		}

		// Create stash entry
		const stashId = uuidv4();
		const stashDir = path.join(stashPath, stashId);
		await fs.mkdir(stashDir, { recursive: true });

		// Copy all working files to stash
		for (const file of workingFiles) {
			await fs.copyFile(
				path.join(workingDir, file),
				path.join(stashDir, file)
			);
		}

		// Save stash metadata
		await fs.writeFile(
			path.join(stashDir, "stash.json"),
			JSON.stringify({
				message: message || "WIP on branch",
				date: new Date().toISOString(),
				commit: currentCommit,
			})
		);

		// Restore working directory to last commit
		if (currentCommit) {
			const commitPath = path.join(repoPath, "commits", currentCommit);
			const commitFiles = await fs.readdir(commitPath);

			for (const file of commitFiles) {
				if (file !== "commit.json") {
					await fs.copyFile(
						path.join(commitPath, file),
						path.join(workingDir, file)
					);
				}
			}
		}

		console.log(`Saved working directory to stash ${stashId.substring(0, 7)}`);
		if (message) {
			console.log(`Message: ${message}`);
		}
	} catch (error) {
		console.error("Error stashing changes:", error);
	}
}

/**
 * List all stashes
 */
async function stashList() {
	const repoPath = path.resolve(process.cwd(), ".customGit");
	const stashPath = path.join(repoPath, "stash");

	try {
		const stashes = await fs.readdir(stashPath);

		if (stashes.length === 0) {
			console.log("No stashes found");
			return;
		}

		console.log("Stashed changes:\n");

		for (let i = 0; i < stashes.length; i++) {
			const stashId = stashes[i];
			const stashJsonPath = path.join(stashPath, stashId, "stash.json");

			try {
				const stashData = await fs.readFile(stashJsonPath, "utf-8");
				const stash = JSON.parse(stashData);
				const shortId = stashId.substring(0, 7);
				const date = new Date(stash.date).toLocaleString();

				console.log(`stash@{${i}}: ${shortId} - ${stash.message}`);
				console.log(`  Date: ${date}\n`);
			} catch (error) {
				// Skip invalid stashes
			}
		}
	} catch (error) {
		if (error.code === "ENOENT") {
			console.log("No stashes found");
		} else {
			console.error("Error listing stashes:", error);
		}
	}
}

/**
 * Apply a stash
 * @param {number} index - Stash index (default: 0 for most recent)
 */
async function stashApply(index = 0) {
	const repoPath = path.resolve(process.cwd(), ".customGit");
	const stashPath = path.join(repoPath, "stash");
	const workingDir = path.resolve(repoPath, "..");

	try {
		const stashes = await fs.readdir(stashPath);

		if (stashes.length === 0) {
			console.log("No stashes to apply");
			return;
		}

		if (index >= stashes.length) {
			console.log(`Stash index ${index} does not exist`);
			return;
		}

		const stashId = stashes[index];
		const stashDir = path.join(stashPath, stashId);
		const files = await fs.readdir(stashDir);

		// Apply stashed files to working directory
		for (const file of files) {
			if (file !== "stash.json") {
				await fs.copyFile(
					path.join(stashDir, file),
					path.join(workingDir, file)
				);
			}
		}

		console.log(`Applied stash@{${index}}`);
	} catch (error) {
		console.error("Error applying stash:", error);
	}
}

/**
 * Apply and remove a stash
 * @param {number} index - Stash index (default: 0 for most recent)
 */
async function stashPop(index = 0) {
	const repoPath = path.resolve(process.cwd(), ".customGit");
	const stashPath = path.join(repoPath, "stash");

	try {
		await stashApply(index);

		const stashes = await fs.readdir(stashPath);
		if (index < stashes.length) {
			const stashId = stashes[index];
			const stashDir = path.join(stashPath, stashId);

			// Remove stash directory
			await fs.rm(stashDir, { recursive: true, force: true });
			console.log(`Dropped stash@{${index}}`);
		}
	} catch (error) {
		console.error("Error popping stash:", error);
	}
}

/**
 * Clear all stashes
 */
async function stashClear() {
	const repoPath = path.resolve(process.cwd(), ".customGit");
	const stashPath = path.join(repoPath, "stash");

	try {
		await fs.rm(stashPath, { recursive: true, force: true });
		await fs.mkdir(stashPath, { recursive: true });
		console.log("All stashes cleared");
	} catch (error) {
		console.error("Error clearing stashes:", error);
	}
}

module.exports = {
	stash,
	stashList,
	stashApply,
	stashPop,
	stashClear,
};

const fs = require("fs").promises;
const path = require("path");
const { getCurrentBranch } = require("./branch");

/**
 * Merge a branch into the current branch
 * @param {string} sourceBranch - Name of the branch to merge from
 */
async function merge(sourceBranch) {
	const repoPath = path.resolve(process.cwd(), ".customGit");
	const branchesPath = path.join(repoPath, "refs", "heads");
	const headPath = path.join(repoPath, "HEAD");
	const workingDir = path.resolve(repoPath, "..");

	try {
		// Get current branch
		const currentBranch = await getCurrentBranch();

		if (currentBranch === sourceBranch) {
			console.log("Cannot merge a branch into itself");
			return;
		}

		// Get current branch commit
		const currentBranchPath = path.join(branchesPath, currentBranch);
		const currentBranchContent = await fs.readFile(currentBranchPath, "utf-8");
		const currentBranchData = JSON.parse(currentBranchContent);
		const currentCommit = currentBranchData.commit;

		// Get source branch commit
		const sourceBranchPath = path.join(branchesPath, sourceBranch);
		let sourceBranchContent;
		try {
			sourceBranchContent = await fs.readFile(sourceBranchPath, "utf-8");
		} catch (error) {
			console.error(`Branch '${sourceBranch}' does not exist`);
			return;
		}

		const sourceBranchData = JSON.parse(sourceBranchContent);
		const sourceCommit = sourceBranchData.commit;

		if (!sourceCommit) {
			console.log(`Branch '${sourceBranch}' has no commits to merge`);
			return;
		}

		if (!currentCommit) {
			console.log("Current branch has no commits. Use 'switch' to change to the source branch.");
			return;
		}

		// Check if branches are already merged
		if (currentCommit === sourceCommit) {
			console.log("Already up to date");
			return;
		}

		// Get files from both commits
		const currentCommitPath = path.join(repoPath, "commits", currentCommit);
		const sourceCommitPath = path.join(repoPath, "commits", sourceCommit);

		const currentFiles = (await fs.readdir(currentCommitPath)).filter(
			(f) => f !== "commit.json"
		);
		const sourceFiles = (await fs.readdir(sourceCommitPath)).filter(
			(f) => f !== "commit.json"
		);

		// Detect conflicts
		const conflicts = [];
		const allFiles = new Set([...currentFiles, ...sourceFiles]);

		for (const file of allFiles) {
			const currentFilePath = path.join(currentCommitPath, file);
			const sourceFilePath = path.join(sourceCommitPath, file);

			const currentExists = currentFiles.includes(file);
			const sourceExists = sourceFiles.includes(file);

			if (currentExists && sourceExists) {
				// Both branches have the file - check for conflicts
				const currentContent = await fs.readFile(currentFilePath, "utf-8");
				const sourceContent = await fs.readFile(sourceFilePath, "utf-8");

				if (currentContent !== sourceContent) {
					conflicts.push({
						file,
						type: "modified",
						currentContent,
						sourceContent,
					});
				}
			}
		}

		// Handle merge
		if (conflicts.length > 0) {
			console.log(`\nMerge conflict detected in ${conflicts.length} file(s):\n`);

			for (const conflict of conflicts) {
				console.log(`  - ${conflict.file}`);

				// Create conflict markers in the file
				const conflictContent = `<<<<<<< ${currentBranch}
${conflict.currentContent}
=======
${conflict.sourceContent}
>>>>>>> ${sourceBranch}
`;

				// Write conflict to working directory
				await fs.writeFile(
					path.join(workingDir, conflict.file),
					conflictContent
				);
			}

			console.log(
				"\nAutomatic merge failed. Fix conflicts and then commit the result."
			);
			console.log("Conflict markers have been added to the affected files.");
		} else {
			// No conflicts - perform fast-forward merge
			console.log(`Merging '${sourceBranch}' into '${currentBranch}'...`);

			// Copy all files from source commit to working directory
			for (const file of sourceFiles) {
				await fs.copyFile(
					path.join(sourceCommitPath, file),
					path.join(workingDir, file)
				);
			}

			// Update current branch to point to source commit
			await fs.writeFile(
				currentBranchPath,
				JSON.stringify({
					commit: sourceCommit,
					updated: new Date().toISOString(),
				})
			);

			// Update HEAD
			await fs.writeFile(
				headPath,
				JSON.stringify({
					branch: currentBranch,
					commit: sourceCommit,
					updated: new Date().toISOString(),
				})
			);

			console.log(`Fast-forward merge successful`);
			console.log(`Branch '${currentBranch}' is now at commit ${sourceCommit}`);
		}
	} catch (error) {
		console.error("Error merging branches:", error);
	}
}

/**
 * Abort a merge in progress
 */
async function mergeAbort() {
	const repoPath = path.resolve(process.cwd(), ".customGit");
	const headPath = path.join(repoPath, "HEAD");
	const workingDir = path.resolve(repoPath, "..");

	try {
		// Get current commit
		const headContent = await fs.readFile(headPath, "utf-8");
		const headData = JSON.parse(headContent);
		const currentCommit = headData.commit;

		if (!currentCommit) {
			console.log("No commit to restore to");
			return;
		}

		// Restore working directory to current commit
		const commitPath = path.join(repoPath, "commits", currentCommit);
		const files = await fs.readdir(commitPath);

		for (const file of files) {
			if (file !== "commit.json") {
				await fs.copyFile(
					path.join(commitPath, file),
					path.join(workingDir, file)
				);
			}
		}

		console.log("Merge aborted. Working directory restored.");
	} catch (error) {
		console.error("Error aborting merge:", error);
	}
}

module.exports = { merge, mergeAbort };

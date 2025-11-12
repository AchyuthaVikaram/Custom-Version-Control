const fs = require("fs").promises;
const path = require("path");

/**
 * Show differences between working directory and last commit
 * @param {string} filename - Optional specific file to diff
 */
async function diff(filename = null) {
	const repoPath = path.resolve(process.cwd(), ".customGit");
	const headPath = path.join(repoPath, "HEAD");
	const workingDir = path.resolve(repoPath, "..");

	try {
		// Get HEAD commit
		let headCommit = null;
		try {
			const headContent = await fs.readFile(headPath, "utf-8");
			const headData = JSON.parse(headContent);
			headCommit = headData.commit;
		} catch (error) {
			console.log("No commits to compare against");
			return;
		}

		if (!headCommit) {
			console.log("No commits to compare against");
			return;
		}

		const commitPath = path.join(repoPath, "commits", headCommit);

		// Get files to compare
		let filesToCompare = [];
		if (filename) {
			filesToCompare = [filename];
		} else {
			// Compare all files in commit
			const commitFiles = await fs.readdir(commitPath);
			filesToCompare = commitFiles.filter((file) => file !== "commit.json");
		}

		let hasDifferences = false;

		for (const file of filesToCompare) {
			const workingFilePath = path.join(workingDir, file);
			const committedFilePath = path.join(commitPath, file);

			try {
				// Check if file exists in working directory
				let workingContent = "";
				try {
					workingContent = await fs.readFile(workingFilePath, "utf-8");
				} catch (error) {
					if (error.code === "ENOENT") {
						console.log(`\ndiff --customgit a/${file} b/${file}`);
						console.log(`--- a/${file}`);
						console.log(`+++ /dev/null`);
						console.log(`File deleted: ${file}`);
						hasDifferences = true;
						continue;
					}
					throw error;
				}

				const committedContent = await fs.readFile(committedFilePath, "utf-8");

				// Compare contents
				if (workingContent !== committedContent) {
					hasDifferences = true;
					console.log(`\ndiff --customgit a/${file} b/${file}`);
					console.log(`--- a/${file}`);
					console.log(`+++ b/${file}`);

					// Simple line-by-line diff
					const committedLines = committedContent.split("\n");
					const workingLines = workingContent.split("\n");

					const maxLines = Math.max(committedLines.length, workingLines.length);

					for (let i = 0; i < maxLines; i++) {
						const committedLine = committedLines[i] || "";
						const workingLine = workingLines[i] || "";

						if (committedLine !== workingLine) {
							if (committedLine && !workingLine) {
								console.log(`-${committedLine}`);
							} else if (!committedLine && workingLine) {
								console.log(`+${workingLine}`);
							} else {
								console.log(`-${committedLine}`);
								console.log(`+${workingLine}`);
							}
						}
					}
				}
			} catch (error) {
				console.error(`Error comparing ${file}:`, error.message);
			}
		}

		if (!hasDifferences) {
			console.log("No differences found");
		}
	} catch (error) {
		console.error("Error generating diff:", error);
	}
}

/**
 * Show differences between staging area and last commit
 */
async function diffStaged() {
	const repoPath = path.resolve(process.cwd(), ".customGit");
	const stagingPath = path.join(repoPath, "staging");
	const headPath = path.join(repoPath, "HEAD");

	try {
		// Get HEAD commit
		let headCommit = null;
		try {
			const headContent = await fs.readFile(headPath, "utf-8");
			const headData = JSON.parse(headContent);
			headCommit = headData.commit;
		} catch (error) {
			console.log("No commits to compare against");
			return;
		}

		// Get staged files
		let stagedFiles = [];
		try {
			stagedFiles = await fs.readdir(stagingPath);
		} catch (error) {
			console.log("No staged files");
			return;
		}

		if (stagedFiles.length === 0) {
			console.log("No staged files");
			return;
		}

		let hasDifferences = false;

		for (const file of stagedFiles) {
			const stagedFilePath = path.join(stagingPath, file);
			const stagedContent = await fs.readFile(stagedFilePath, "utf-8");

			console.log(`\ndiff --customgit a/${file} b/${file}`);
			console.log(`--- a/${file}`);
			console.log(`+++ b/${file} (staged)`);

			if (headCommit) {
				const committedFilePath = path.join(
					repoPath,
					"commits",
					headCommit,
					file
				);

				try {
					const committedContent = await fs.readFile(committedFilePath, "utf-8");

					if (stagedContent !== committedContent) {
						hasDifferences = true;
						const committedLines = committedContent.split("\n");
						const stagedLines = stagedContent.split("\n");
						const maxLines = Math.max(committedLines.length, stagedLines.length);

						for (let i = 0; i < maxLines; i++) {
							const committedLine = committedLines[i] || "";
							const stagedLine = stagedLines[i] || "";

							if (committedLine !== stagedLine) {
								if (committedLine && !stagedLine) {
									console.log(`-${committedLine}`);
								} else if (!committedLine && stagedLine) {
									console.log(`+${stagedLine}`);
								} else {
									console.log(`-${committedLine}`);
									console.log(`+${stagedLine}`);
								}
							}
						}
					}
				} catch (error) {
					// File is new
					console.log(`New file: ${file}`);
					hasDifferences = true;
				}
			} else {
				// No previous commit, all staged files are new
				console.log(`New file: ${file}`);
				hasDifferences = true;
			}
		}

		if (!hasDifferences) {
			console.log("No differences in staged files");
		}
	} catch (error) {
		console.error("Error generating diff:", error);
	}
}

module.exports = { diff, diffStaged };

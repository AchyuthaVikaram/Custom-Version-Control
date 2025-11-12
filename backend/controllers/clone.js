const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws_config");

/**
 * Clone a repository from S3
 * @param {string} repoName - Name of the repository to clone
 * @param {string} targetDir - Optional target directory (defaults to repo name)
 */
async function clone(repoName, targetDir = null) {
	const cloneDir = targetDir || repoName;
	const repoPath = path.resolve(process.cwd(), cloneDir, ".customGit");

	try {
		// Create directory structure
		await fs.mkdir(path.join(repoPath, "commits"), { recursive: true });
		await fs.mkdir(path.join(repoPath, "refs", "heads"), { recursive: true });

		console.log(`Cloning repository '${repoName}' into '${cloneDir}'...`);

		// Download all commits from S3
		const data = await s3
			.listObjectsV2({
				Bucket: S3_BUCKET,
				Prefix: `${repoName}/commits/`,
			})
			.promise();

		if (!data.Contents || data.Contents.length === 0) {
			console.log(`Repository '${repoName}' not found or is empty`);
			return;
		}

		const objects = data.Contents;
		let fileCount = 0;

		for (const object of objects) {
			const key = object.Key;
			// Remove repo name prefix from key
			const relativePath = key.replace(`${repoName}/`, "");

			const params = {
				Bucket: S3_BUCKET,
				Key: key,
			};

			const fileContent = await s3.getObject(params).promise();
			const filePath = path.join(repoPath, relativePath);

			// Create directory if needed
			await fs.mkdir(path.dirname(filePath), { recursive: true });

			// Write file
			await fs.writeFile(filePath, fileContent.Body);
			fileCount++;
		}

		// Create config file
		await fs.writeFile(
			path.join(repoPath, "config.json"),
			JSON.stringify({
				bucket: S3_BUCKET,
				remote: repoName,
				cloned: new Date().toISOString(),
			})
		);

		// Get the latest commit and set up HEAD
		const commitDirs = await fs.readdir(path.join(repoPath, "commits"));
		if (commitDirs.length > 0) {
			// Find most recent commit
			let latestCommit = null;
			let latestDate = null;

			for (const commitId of commitDirs) {
				const commitJsonPath = path.join(
					repoPath,
					"commits",
					commitId,
					"commit.json"
				);
				try {
					const commitData = await fs.readFile(commitJsonPath, "utf-8");
					const commit = JSON.parse(commitData);
					const commitDate = new Date(commit.date);

					if (!latestDate || commitDate > latestDate) {
						latestDate = commitDate;
						latestCommit = commitId;
					}
				} catch (error) {
					// Skip invalid commits
				}
			}

			if (latestCommit) {
				// Create master branch
				await fs.writeFile(
					path.join(repoPath, "refs", "heads", "master"),
					JSON.stringify({
						commit: latestCommit,
						created: new Date().toISOString(),
					})
				);

				// Set HEAD to master
				await fs.writeFile(
					path.join(repoPath, "HEAD"),
					JSON.stringify({
						branch: "master",
						commit: latestCommit,
						updated: new Date().toISOString(),
					})
				);

				// Checkout files from latest commit
				const commitPath = path.join(repoPath, "commits", latestCommit);
				const files = await fs.readdir(commitPath);
				const workingDir = path.resolve(repoPath, "..");

				for (const file of files) {
					if (file !== "commit.json") {
						await fs.copyFile(
							path.join(commitPath, file),
							path.join(workingDir, file)
						);
					}
				}
			}
		}

		console.log(`Successfully cloned ${fileCount} files`);
		console.log(`Repository cloned to '${cloneDir}'`);
	} catch (error) {
		console.error("Error cloning repository:", error);
	}
}

module.exports = { clone };

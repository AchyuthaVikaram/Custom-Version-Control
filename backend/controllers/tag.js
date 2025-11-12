const fs = require("fs").promises;
const path = require("path");

/**
 * Create a tag for a commit
 * @param {string} tagName - Name of the tag
 * @param {string} commitId - Optional commit ID (defaults to HEAD)
 * @param {string} message - Optional tag message
 */
async function createTag(tagName, commitId = null, message = null) {
	const repoPath = path.resolve(process.cwd(), ".customGit");
	const tagsPath = path.join(repoPath, "refs", "tags");
	const headPath = path.join(repoPath, "HEAD");

	try {
		// Create tags directory if it doesn't exist
		await fs.mkdir(tagsPath, { recursive: true });

		// Get commit ID
		let targetCommit = commitId;
		if (!targetCommit) {
			// Use HEAD commit
			try {
				const headContent = await fs.readFile(headPath, "utf-8");
				const headData = JSON.parse(headContent);
				targetCommit = headData.commit;
			} catch (error) {
				console.log("No commit to tag. Make a commit first.");
				return;
			}
		}

		if (!targetCommit) {
			console.log("No commit to tag. Make a commit first.");
			return;
		}

		// Check if tag already exists
		const tagPath = path.join(tagsPath, tagName);
		try {
			await fs.access(tagPath);
			console.log(`Tag '${tagName}' already exists`);
			return;
		} catch (error) {
			// Tag doesn't exist, continue
		}

		// Create tag
		await fs.writeFile(
			tagPath,
			JSON.stringify({
				commit: targetCommit,
				message: message || `Tag ${tagName}`,
				created: new Date().toISOString(),
			})
		);

		console.log(`Tag '${tagName}' created for commit ${targetCommit.substring(0, 7)}`);
		if (message) {
			console.log(`Message: ${message}`);
		}
	} catch (error) {
		console.error("Error creating tag:", error);
	}
}

/**
 * List all tags
 */
async function listTags() {
	const repoPath = path.resolve(process.cwd(), ".customGit");
	const tagsPath = path.join(repoPath, "refs", "tags");

	try {
		const tags = await fs.readdir(tagsPath);

		if (tags.length === 0) {
			console.log("No tags found");
			return;
		}

		console.log("Tags:\n");

		for (const tagName of tags) {
			const tagPath = path.join(tagsPath, tagName);
			try {
				const tagContent = await fs.readFile(tagPath, "utf-8");
				const tagData = JSON.parse(tagContent);
				const shortCommit = tagData.commit.substring(0, 7);
				const date = new Date(tagData.created).toLocaleString();

				console.log(`${tagName}`);
				console.log(`  Commit: ${shortCommit}`);
				console.log(`  Date: ${date}`);
				if (tagData.message) {
					console.log(`  Message: ${tagData.message}`);
				}
				console.log();
			} catch (error) {
				console.log(`${tagName} (invalid)`);
			}
		}
	} catch (error) {
		if (error.code === "ENOENT") {
			console.log("No tags found");
		} else {
			console.error("Error listing tags:", error);
		}
	}
}

/**
 * Delete a tag
 * @param {string} tagName - Name of the tag to delete
 */
async function deleteTag(tagName) {
	const repoPath = path.resolve(process.cwd(), ".customGit");
	const tagPath = path.join(repoPath, "refs", "tags", tagName);

	try {
		await fs.unlink(tagPath);
		console.log(`Tag '${tagName}' deleted`);
	} catch (error) {
		if (error.code === "ENOENT") {
			console.error(`Tag '${tagName}' does not exist`);
		} else {
			console.error("Error deleting tag:", error);
		}
	}
}

/**
 * Show tag details
 * @param {string} tagName - Name of the tag
 */
async function showTag(tagName) {
	const repoPath = path.resolve(process.cwd(), ".customGit");
	const tagPath = path.join(repoPath, "refs", "tags", tagName);

	try {
		const tagContent = await fs.readFile(tagPath, "utf-8");
		const tagData = JSON.parse(tagContent);

		console.log(`Tag: ${tagName}`);
		console.log(`Commit: ${tagData.commit}`);
		console.log(`Created: ${new Date(tagData.created).toLocaleString()}`);
		if (tagData.message) {
			console.log(`Message: ${tagData.message}`);
		}

		// Show commit details
		const commitPath = path.join(repoPath, "commits", tagData.commit, "commit.json");
		try {
			const commitContent = await fs.readFile(commitPath, "utf-8");
			const commitData = JSON.parse(commitContent);
			console.log(`\nCommit Message: ${commitData.message}`);
			console.log(`Commit Date: ${new Date(commitData.date).toLocaleString()}`);
		} catch (error) {
			// Commit details not available
		}
	} catch (error) {
		if (error.code === "ENOENT") {
			console.error(`Tag '${tagName}' does not exist`);
		} else {
			console.error("Error showing tag:", error);
		}
	}
}

module.exports = {
	createTag,
	listTags,
	deleteTag,
	showTag,
};

const fs = require("fs");
const path = require("path");
const { promisify } = require("util"); // checks that  if it exits or not

const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);

async function revert(commitID) {
	const repoPath = path.resolve(process.cwd(), ".customGit");
	const commitsPath = path.join(repoPath, "commits");

	try {
		const commitDir = path.join(commitsPath, commitID);
		const files = await readdir(commitDir);
		const parentDir = path.resolve(repoPath, "..");

		for (const file of files) {
			await copyFile(path.join(commitDir, file), path.join(parentDir, file));
		}

		console.log(`Commit ${commitID} reverted successfully!`);
	} catch (err) {
		console.error("Unable to revert : ", err);
	}
}

module.exports = { revert };

const fs = require("fs").promises;
const path = require("path");
async function add(filepath) {
	const repoPath = path.resolve(process.cwd(), ".customGit");
	const stagingPath = path.join(repoPath, "staging");
	try {
		await fs.mkdir(stagingPath, { recursive: true });
		const fileName = path.basename(filepath);
		await fs.copyFile(filepath, path.join(stagingPath, fileName));

		console.log(`file ${fileName} added to stazing area`);
	} catch (error) {
		console.log("error in adding files to staged area :" + error);
	}
}

module.exports = { add };

const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws_config");

async function pull() {
	const repoPath = path.resolve(process.cwd(), ".customGit");
	const commitsPath = path.join(repoPath, "commits");

	try {
		const data = await s3.listObjectsV2({ Bucket: S3_BUCKET, Prefix: "commits/" }).promise();
		const objects = data.Contents || [];

		for (const object of objects) {
			const commitHash = object.Key.split("/")[1];
			const commitPath = path.join(commitsPath, commitHash);

			try {
				// Check if the file already exists
				await fs.access(commitPath).catch(() => false);

				// Fetch the object from S3
				const fileContent = await s3.getObject({ Bucket: S3_BUCKET, Key: object.Key }).promise();

				// Ensure the directory exists before writing the file
				await fs.mkdir(path.dirname(commitPath), { recursive: true });

				// Write file
				await fs.writeFile(commitPath, fileContent.Body);

				console.log(`Pulled: ${commitHash}`);
			} catch (fileError) {
				console.error(`Error processing commit ${commitHash}:`, fileError);
			}
		}

		console.log("All objects pulled from S3.");
	} catch (error) {
		console.error("Error while pulling from S3:", error);
	}
}

module.exports = { pull };

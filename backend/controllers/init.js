const fs = require("fs").promises; // Using the 'fs' module with promises allows us to perform asynchronous file operations, preventing the blocking of the event loop.
const path = require("path"); // The 'path' module ensures cross-platform compatibility when dealing with file paths.

async function init() {
	// Define the repository path inside the current working directory
	const repoPath = path.resolve(process.cwd(), ".customGit");
	// This creates a hidden folder named ".customGit" in the project's root directory.
	// Keeping it hidden ensures that it doesn't interfere with normal project files.

	const commitsPath = path.join(repoPath, "commits");
	// The "commits" folder inside ".customGit" is required to store commit snapshots.
	// This structure mimics Git, which tracks changes by storing them inside a special directory.

	try {
		// Create the main repository folder (if it doesn't already exist)
		await fs.mkdir(repoPath, { recursive: true });
		// The 'recursive: true' option ensures that parent directories are created if missing.
		// This is important because users might initialize the repository in deeply nested folders.

		// Create a subfolder named "commits" to store commit history
		await fs.mkdir(commitsPath, { recursive: true });
		// This ensures that we have a dedicated place to store version history.
		// Without this, the repository won't have a structured way to manage commits.

		// Create a configuration file to store metadata such as S3 bucket information
		await fs.writeFile(
			path.join(repoPath, "config.json"),
			JSON.stringify({ bucket: "S3 BUCKET" }) // The S3 bucket is used for remote storage of repository data.
		);
		// This configuration file is crucial for tracking remote storage locations.
		// Without it, we wouldn't know where to push or pull commits from.

		console.log("Repository initialized");
	} catch (error) {
		console.log("Error initializing repository: " + error);
	}
}

module.exports = { init }; 
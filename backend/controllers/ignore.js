const fs = require("fs").promises;
const path = require("path");

/**
 * Check if a file should be ignored based on .customignore rules
 * @param {string} filePath - Path to the file to check
 * @param {string} repoPath - Path to the repository root
 * @returns {Promise<boolean>} - True if file should be ignored
 */
async function shouldIgnore(filePath, repoPath) {
	const ignorePath = path.join(path.resolve(repoPath, ".."), ".customignore");

	try {
		const ignoreContent = await fs.readFile(ignorePath, "utf-8");
		const ignorePatterns = ignoreContent
			.split("\n")
			.map((line) => line.trim())
			.filter((line) => line && !line.startsWith("#"));

		const fileName = path.basename(filePath);
		const relativePath = path.relative(path.resolve(repoPath, ".."), filePath);

		for (const pattern of ignorePatterns) {
			// Simple pattern matching
			if (pattern === fileName || pattern === relativePath) {
				return true;
			}

			// Wildcard matching
			if (pattern.includes("*")) {
				const regex = new RegExp(
					"^" + pattern.replace(/\*/g, ".*").replace(/\?/g, ".") + "$"
				);
				if (regex.test(fileName) || regex.test(relativePath)) {
					return true;
				}
			}

			// Directory matching
			if (pattern.endsWith("/")) {
				const dirPattern = pattern.slice(0, -1);
				if (relativePath.startsWith(dirPattern)) {
					return true;
				}
			}

			// Extension matching
			if (pattern.startsWith("*.")) {
				const ext = pattern.slice(1);
				if (fileName.endsWith(ext)) {
					return true;
				}
			}
		}

		return false;
	} catch (error) {
		// No .customignore file or error reading it
		return false;
	}
}

/**
 * Get all files in directory excluding ignored files
 * @param {string} dirPath - Directory to scan
 * @param {string} repoPath - Path to repository root
 * @returns {Promise<string[]>} - Array of non-ignored file paths
 */
async function getTrackedFiles(dirPath, repoPath) {
	const files = [];

	async function scanDir(currentPath) {
		const entries = await fs.readdir(currentPath, { withFileTypes: true });

		for (const entry of entries) {
			const fullPath = path.join(currentPath, entry.name);

			// Skip .customGit directory
			if (entry.name === ".customGit") {
				continue;
			}

			// Check if should be ignored
			const ignored = await shouldIgnore(fullPath, repoPath);
			if (ignored) {
				continue;
			}

			if (entry.isDirectory()) {
				await scanDir(fullPath);
			} else {
				files.push(fullPath);
			}
		}
	}

	await scanDir(dirPath);
	return files;
}

/**
 * Create a default .customignore file
 */
async function createDefaultIgnore() {
	const workingDir = process.cwd();
	const ignorePath = path.join(workingDir, ".customignore");

	const defaultIgnore = `# Custom Version Control Ignore File
# Add patterns of files to ignore (one per line)

# Dependencies
node_modules/
vendor/

# Build outputs
dist/
build/
*.exe
*.dll
*.so
*.dylib

# Logs
*.log
logs/

# OS files
.DS_Store
Thumbs.db
desktop.ini

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# Environment files
.env
.env.local

# Temporary files
*.tmp
*.temp
*.cache
`;

	try {
		// Check if file already exists
		await fs.access(ignorePath);
		console.log(".customignore file already exists");
	} catch (error) {
		// File doesn't exist, create it
		await fs.writeFile(ignorePath, defaultIgnore);
		console.log(".customignore file created successfully");
	}
}

module.exports = {
	shouldIgnore,
	getTrackedFiles,
	createDefaultIgnore,
};

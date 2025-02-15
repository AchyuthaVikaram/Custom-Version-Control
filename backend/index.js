const yargs = require("yargs"); // Importing yargs, an npm package used for handling command-line arguments
const { hideBin } = require("yargs/helpers"); // Extracts the actual command from the process arguments
const { init } = require("./controllers/init");
const { add } = require("./controllers/add");
const { commit } = require("./controllers/commit");
const { pull } = require("./controllers/pull");
const { push } = require("./controllers/push");
const { revert } = require("./controllers/revert");

// Configuring yargs to handle different commands
yargs(hideBin(process.argv))
	.command("init", "Initialise a new repository", {}, init) // Define 'init' command to initialize a new repository
	.command(
		"add <file>", // Command to add a file to staging
		"Add a file to the repository",
		(yargs) => {
			yargs.positional("file", {
				describe: "File to add to the staging area",
				type: "string",
			});
		},
		(argv) => {
			add(argv.file);
		} // Executes the 'add' function
	)
	.command(
		"commit <message>", // Command to commit staged files
		"Commit the staged files",
		(yargs) => {
			yargs.positional("message", {
				describe: "Commit message",
				type: "string",
			});
		},
		(argv)=>{
			commit(argv.message)
		} // Executes the 'commit' function
	)
	.command("push", "Push commits to S3", {}, push) // Command to push commits to an S3 storage
	.command("pull", "Pull commits from S3", {}, pull) // Command to pull commits from S3
	.command(
		"revert <commitID>", // Command to revert to a specific commit
		"Revert to a specific commit",
		(yargs) => {
			yargs.positional("commitID", {
				describe: "Commit ID to revert to",
				type: "string",
			});
		},
		revert // Executes the 'revert' function
	)
	.demandCommand(1, "You need at least one command") // Ensures at least one command is provided
	.help().argv; // Enables help documentation for command usage

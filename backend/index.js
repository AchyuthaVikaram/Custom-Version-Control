const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const Router = require("./routers/main.route");

dotenv.config();

const yargs = require("yargs"); // Importing yargs, an npm package used for handling command-line arguments
const { hideBin } = require("yargs/helpers"); // Extracts the actual command from the process arguments
const { init } = require("./controllers/init");
const { add } = require("./controllers/add");
const { commit } = require("./controllers/commit");
const { pull } = require("./controllers/pull");
const { push } = require("./controllers/push");
const { revert } = require("./controllers/revert");
const { createBranch, switchBranch, listBranches, deleteBranch } = require("./controllers/branch");
const { status } = require("./controllers/status");
const { log, logOneline } = require("./controllers/log");
const { diff, diffStaged } = require("./controllers/diff");
const { merge, mergeAbort } = require("./controllers/merge");
const { clone } = require("./controllers/clone");
const { createDefaultIgnore } = require("./controllers/ignore");
const { stash, stashList, stashApply, stashPop, stashClear } = require("./controllers/stash");
const { createTag, listTags, deleteTag, showTag } = require("./controllers/tag");

// Configuring yargs to handle different commands
yargs(hideBin(process.argv))
	.command("start", "starts a new server", {}, startServer)
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
		(argv) => {
			commit(argv.message);
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
		(argv) => revert(argv.commitID) // Executes the 'revert' function
	)
	.command(
		"branch <action> [name]",
		"Manage branches (create, switch, list, delete)",
		(yargs) => {
			yargs.positional("action", {
				describe: "Action: create, switch, list, delete",
				type: "string",
			});
			yargs.positional("name", {
				describe: "Branch name",
				type: "string",
			});
		},
		(argv) => {
			switch (argv.action) {
				case "create":
					createBranch(argv.name);
					break;
				case "switch":
					switchBranch(argv.name);
					break;
				case "list":
					listBranches();
					break;
				case "delete":
					deleteBranch(argv.name);
					break;
				default:
					console.log("Invalid action. Use: create, switch, list, or delete");
			}
		}
	)
	.command("status", "Show working directory status", {}, status)
	.command(
		"log [limit]",
		"Show commit history",
		(yargs) => {
			yargs.positional("limit", {
				describe: "Number of commits to show",
				type: "number",
			});
		},
		(argv) => log(argv.limit)
	)
	.command("log-oneline", "Show commit history in one line format", {}, logOneline)
	.command(
		"diff [file]",
		"Show differences between working directory and last commit",
		(yargs) => {
			yargs.positional("file", {
				describe: "Specific file to diff",
				type: "string",
			});
		},
		(argv) => diff(argv.file)
	)
	.command("diff-staged", "Show differences in staged files", {}, diffStaged)
	.command(
		"merge <branch>",
		"Merge a branch into current branch",
		(yargs) => {
			yargs.positional("branch", {
				describe: "Branch to merge from",
				type: "string",
			});
		},
		(argv) => merge(argv.branch)
	)
	.command("merge-abort", "Abort merge in progress", {}, mergeAbort)
	.command(
		"clone <repo> [dir]",
		"Clone a repository from S3",
		(yargs) => {
			yargs.positional("repo", {
				describe: "Repository name",
				type: "string",
			});
			yargs.positional("dir", {
				describe: "Target directory",
				type: "string",
			});
		},
		(argv) => clone(argv.repo, argv.dir)
	)
	.command("ignore-init", "Create default .customignore file", {}, createDefaultIgnore)
	.command(
		"stash [message]",
		"Stash current changes",
		(yargs) => {
			yargs.positional("message", {
				describe: "Stash message",
				type: "string",
			});
		},
		(argv) => stash(argv.message)
	)
	.command("stash-list", "List all stashes", {}, stashList)
	.command(
		"stash-apply [index]",
		"Apply a stash",
		(yargs) => {
			yargs.positional("index", {
				describe: "Stash index",
				type: "number",
				default: 0,
			});
		},
		(argv) => stashApply(argv.index)
	)
	.command(
		"stash-pop [index]",
		"Apply and remove a stash",
		(yargs) => {
			yargs.positional("index", {
				describe: "Stash index",
				type: "number",
				default: 0,
			});
		},
		(argv) => stashPop(argv.index)
	)
	.command("stash-clear", "Clear all stashes", {}, stashClear)
	.command(
		"tag <action> [name] [commit] [message]",
		"Manage tags (create, list, delete, show)",
		(yargs) => {
			yargs.positional("action", {
				describe: "Action: create, list, delete, show",
				type: "string",
			});
			yargs.positional("name", {
				describe: "Tag name",
				type: "string",
			});
			yargs.positional("commit", {
				describe: "Commit ID (for create)",
				type: "string",
			});
			yargs.positional("message", {
				describe: "Tag message (for create)",
				type: "string",
			});
		},
		(argv) => {
			switch (argv.action) {
				case "create":
					createTag(argv.name, argv.commit, argv.message);
					break;
				case "list":
					listTags();
					break;
				case "delete":
					deleteTag(argv.name);
					break;
				case "show":
					showTag(argv.name);
					break;
				default:
					console.log("Invalid action. Use: create, list, delete, or show");
			}
		}
	)
	.demandCommand(1, "You need at least one command") // Ensures at least one command is provided
	.help().argv; // Enables help documentation for command usage

function startServer() {
	const app = express();
	const port = process.env.PORT || 3000;

	app.use(bodyParser.json());
	app.use(express.json());
	app.use(cors({ origin: "*" }));

	const mongourl = process.env.MONGODB_URL;

	mongoose
		.connect(mongourl)
		.then(() => {
			console.log("MongoDB Connected");
		})
		.catch((err) => {
			console.log("Error occured while connecting to mongoDb", err);
		});

	app.use("/", Router);

	const httpServer = http.createServer(app);
	const io = new Server(httpServer, {
		cors: {
			origin: "*",
			methods: ["GET", "POST"],
		},
	});

	io.on("connection", (socket) => {
		console.log(`socket ${socket.id} connected`);

		socket.on("joinRoom", (userID) => {
			const user = userId;
			console.log("=============");
			console.log(user);
			console.log("=============");
			socket.join(userID);
		});
	});
	const db = mongoose.connection;

	db.once("open", async () => {
		console.log("AllCRUD Operations callled");
		//CRUD Operations
	});

	httpServer.listen(port, () => {
		console.log(`server is running on ${port}`);
	});
}

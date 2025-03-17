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

const Repository = require("../models/repoModel.js");
const User = require("../models/userModel.js");
const Issue = require("../models/issueModel.js");
const { default: mongoose } = require("mongoose");

const createRepository = async (req, res) => {
	try {
		const { userId, name, description, content, visibility, issues } = req.body;
		if (!name) {
			return res
				.status(400)
				.json({ message: "Please provide name of Repository" });
		}
		if (!mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).json({ message: "Invalid user id" });
		}
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });
		const repo = await Repository.create({
			name,
			description,
			content,
			visibility,
			issues,
			owner: userId,
		});
		return res.status(201).json({
			message: `Repository ${name} is created sucessfully!`,
			repoId: repo._id,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Server Error",
		});
	}
};

const getAllRepositories = async (req, res) => {
	try {
		const repos = await Repository.find({})
			.populate("owner")
			.populate("issues");
		return res.status(200).json({
			message: `All Repositories fetched sucessfully!`,
			repos,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Server Error",
		});
	}
};

const getRepositoryById = async (req, res) => {
	try {
		const repoId = req.params.id;
		if (!mongoose.Types.ObjectId.isValid(repoId)) {
			return res.status(400).json({ message: "Invalid repository id" });
		}
		const repo = await Repository.findById(repoId)
			.populate("owner")
			.populate("issues");
		if (!repo) return res.status(404).json({ message: "Repository not found" });
		return res.status(200).json({
			message: `Repository ${repo.name} fetched sucessfully!`,
			repo,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Server Error",
		});
	}
};
const getRepositoryByName = async (req, res) => {
	try {
		const name = req.params.name;
		if (!name) {
			return res
				.status(400)
				.json({ message: "Please Provide a Valid Repo name" });
		}
		const repo = await Repository.findOne({ name })
			.populate("owner")
			.populate("issues");
		if (!repo) return res.status(404).json({ message: "Repository not found" });
		return res.status(200).json({
			message: `Repository ${repo.name} fetched sucessfully!`,
			repo,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Server Error",
		});
	}
};

const fetchRepositoryForCurrUser = async (req, res) => {
	try {
		const {userId} = req.params;
		console.log(userId);
		// if (!mongoose.Types.ObjectId.isValid(userId)) {
		// 	return res.status(400).json({ message: "Invalid repository id" });
		// }
		const user = await User.findById(userId);
		
		if (!user) return res.status(404).json({ message: "User not found" });

		const repos = await Repository.find({ owner: userId })
			.populate("owner")
			.populate("issues");
		return res.status(200).json({
			message: `Repositories of a user ${user.username} fetched sucessfully!`,
			repos,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Server Error",
		});
	}
};

const updateRepositoryById = async (req, res) => {
	try {
		const userId = req.user;
		const repoId = req.params.id;
		const { content, description } = req.body;
		if (!mongoose.Types.ObjectId.isValid(repoId)) {
			return res.status(400).json({ message: "Invalid repository id" });
		}
		const repo = await Repository.findById(repoId);
		if (!repo) return res.status(404).json({ message: "Repository not found" });
		if (userId != repo.owner.toString()) {
			return res
				.status(403)
				.json({ message: "You are not the owner of this repository" });
		}
		if (content) repo.content.push(content);
		if (description) repo.description = description;
		const updatedRepo = await repo.save();
		return res.status(200).json({
			message: `Repository ${updatedRepo.name} visibility toggeled successfully!`,
			repo: updatedRepo,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Server Error",
		});
	}
};
const deleteRepositoryById = async (req, res) => {
	try {
		const userId = req.user;
		const repoId = req.params.id;
		if (!mongoose.Types.ObjectId.isValid(repoId)) {
			return res.status(400).json({ message: "Invalid repository id" });
		}
		const repo = await Repository.findById(repoId);
		if (!repo) return res.status(404).json({ message: "Repository not found" });
		if (userId != repo.owner.toString()) {
			return res
				.status(403)
				.json({ message: "You are not the owner of this repository" });
		}
		const deletedRepo = await Repository.findByIdAndDelete(repoId);
		return res.status(200).json({
			message: `Repository ${deletedRepo.name} deleted successfully!`,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Server Error",
		});
	}
};
const toggleVisibility = async (req, res) => {
	try {
		const userId = req.user;
		const repoId = req.params.id;
		if (!mongoose.Types.ObjectId.isValid(repoId)) {
			return res.status(400).json({ message: "Invalid repository id" });
		}
		const repo = await Repository.findById(repoId);
		if (!repo) return res.status(404).json({ message: "Repository not found" });
		if (userId != repo.owner.toString()) {
			return res
				.status(403)
				.json({ message: "You are not the owner of this repository" });
		}
		repo.visibility = !repo.visibility;
		const updatedRepo = await repo.save();
		return res.status(200).json({
			message: `Repository ${updatedRepo.name} updated successfully!`,
			repo: updatedRepo,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Server Error",
		});
	}
};

module.exports = {
	getAllRepositories,
	getRepositoryById,
	fetchRepositoryForCurrUser,
	updateRepositoryById,
	deleteRepositoryById,
	toggleVisibility,
	createRepository,
	getRepositoryByName,
};

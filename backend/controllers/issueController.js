const Issue = require("../models/issueModel.js");

const createIssue = async (req, res) => {
	try {
		const { title, description } = req.body;
		const repoId = req.params.id;

		//check the validity of user & repo
		const issue = new Issue({
			title,
			description,
			repository: repoId,
		});
		const savedIssue = await issue.save();
		res.status(201).json({
			message: `Issue ${title} is created sucessfully!`,
			issueId: savedIssue._id,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Server Error",
		});
	}
};
const updateIssueById = async (req, res) => {
	const { id } = req.params;
	const { title, description, status } = req.body;
	try {
		const issue = await Issue.findById(id);

		if (!issue) {
			return res.status(404).json({ error: "Issue not found!" });
		}

		issue.title = title;
		issue.description = description;
		issue.status = status;

		await issue.save();

		res.json({ message: "Issue updated", issue });
	} catch (err) {
		console.error("Error during issue updation : ", err.message);
		res.status(500).send("Server error");
	}
};
const deleteIssueById = async (req, res) => {
	const { id } = req.params;

	try {
		const issue = Issue.findByIdAndDelete(id);

		if (!issue) {
			return res.status(404).json({ error: "Issue not found!" });
		}
		res.json({ message: "Issue deleted" });
	} catch (err) {
		console.error("Error during issue deletion : ", err.message);
		res.status(500).send("Server error");
	}
};
const getAllIssuesOfRepo = async (req, res) => {
	const { id } = req.params;

	try {
		const issues = Issue.find({ repository: id });

		if (!issues) {
			return res.status(404).json({ error: "Issues not found!" });
		}
		res.status(200).json({
			message: "All issues fetched of repo",
			issues,
		});
	} catch (err) {
		console.error("Error during issue fetching : ", err.message);
		res.status(500).send("Server error");
	}
};
const getIssueById = async (req, res) => {
	const { id } = req.params;
	try {
		const issue = await Issue.findById(id);

		if (!issue) {
			return res.status(404).json({ error: "Issue not found!" });
		}

		res.json(issue);
	} catch (err) {
		console.error("Error during issue updation : ", err.message);
		res.status(500).send("Server error");
	}
};

module.exports = {
	createIssue,
	updateIssueById,
	deleteIssueById,
	getAllIssuesOfRepo,
	getIssueById,
};

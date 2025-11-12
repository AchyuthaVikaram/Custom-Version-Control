const Repository = require("../models/repoModel");
const Issue = require("../models/issueModel");

const isAuthorizedUser = (req, res, next) => {
	if (req.user._id.toString() !== req.params.id) {
		return res.status(403).json({ message: "You are not authorized!" });
	}
	next();
};
const isRepoOwner = async (req, res, next) => {
	const repo = await Repository.findById(req.params.id);
	if (!repo) return res.status(404).json({ message: "Repository not found" });
	
	if (repo.owner.toString() !== req.user.id.toString()) {
		return res
			.status(403)
			.json({ message: "Not authorized to modify this repository" });
	}
	next();
};
const isIssueOwnerOrRepoOwner = async (req, res, next) => {
	try {
		const issue = await Issue.findById(req.params.id);
		if (!issue) return res.status(404).json({ message: "Issue not found" });

		const repo = await Repository.findById(issue.repository); // Fix: use `repository` field
		if (!repo) return res.status(404).json({ message: "Repository not found" });

		// Only repository owner can modify the issue since there is no `creator` field
		if (repo.owner.toString() !== req.user.id) {
			return res
				.status(403)
				.json({ message: "Not authorized to modify this issue" });
		}

		next();
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

module.exports = { isAuthorizedUser, isRepoOwner, isIssueOwnerOrRepoOwner };

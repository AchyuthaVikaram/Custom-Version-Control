const express = require("express");
const issueController = require("../controllers/issueController");
const { isAuthenticated } = require("../middlewares/authentication");
const {
	isRepoOwner,
	isIssueOwnerOrRepoOwner,
} = require("../middlewares/authorization");
const issueRouter = express.Router();

issueRouter.post(
	"/issue/create/:id",
	isAuthenticated,
	isRepoOwner,
	issueController.createIssue
);
issueRouter.put(
	"/issue/update/:id",
	isAuthenticated,
	isIssueOwnerOrRepoOwner,
	issueController.updateIssueById
);
issueRouter.delete(
	"/issue/delete/:id",
	isAuthenticated,
	isIssueOwnerOrRepoOwner,
	issueController.deleteIssueById
);
issueRouter.get("/issue/all", issueController.getAllIssuesOfRepo);
issueRouter.get("/issue/:id", issueController.getIssueById);

module.exports = issueRouter;

const express = require("express");
const repoController = require("../controllers/repoController");
const { isAuthenticated } = require("../middlewares/authentication");
const {
	isAuthorizedUser,
	isRepoOwner,
} = require("../middlewares/authorization");
const repoRouter = express.Router();

repoRouter.get("/repo/all", repoController.getAllRepositories);
repoRouter.get("/repo/:id", repoController.getRepositoryById);
repoRouter.get("/repo/name/:name", repoController.getRepositoryByName);
repoRouter.post(
	"/repo/create",
	isAuthenticated,
	repoController.createRepository
);
repoRouter.get(
	"/repo/user/:userId",
	isAuthenticated,
	isAuthorizedUser,
	repoController.fetchRepositoryForCurrUser
);
repoRouter.put(
	"/repo/update/:id",
	isAuthenticated,
	isRepoOwner,
	repoController.updateRepositoryById
);
repoRouter.delete(
	"/repo/delete/:id",
	isAuthenticated,
	isRepoOwner,
	repoController.deleteRepositoryById
);
repoRouter.patch(
	"/repo/toggle/:id",
	isAuthenticated,
	isRepoOwner,
	repoController.toggleVisibility
);

module.exports = repoRouter;

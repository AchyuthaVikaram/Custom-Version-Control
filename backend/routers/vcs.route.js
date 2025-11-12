const express = require("express");
const Router = express.Router();
const vcsController = require("../controllers/vcsController");
const { isAuthenticated } = require("../middlewares/authentication");

// Branch operations
Router.post("/vcs/branch/create", isAuthenticated, vcsController.createBranch);
Router.post("/vcs/branch/switch", isAuthenticated, vcsController.switchBranch);
Router.get("/vcs/branch/list/:repoId", isAuthenticated, vcsController.listBranches);
Router.delete("/vcs/branch/delete", isAuthenticated, vcsController.deleteBranch);
Router.get("/vcs/branch/current/:repoId", isAuthenticated, vcsController.getCurrentBranch);

// Commit operations
Router.get("/vcs/commits/:repoId", isAuthenticated, vcsController.getCommits);
Router.get("/vcs/commit/:repoId/:commitId", isAuthenticated, vcsController.getCommitDetails);
Router.post("/vcs/commit", isAuthenticated, vcsController.createCommit);

// Status and diff
Router.get("/vcs/status/:repoId", isAuthenticated, vcsController.getStatus);
Router.get("/vcs/diff/:repoId", isAuthenticated, vcsController.getDiff);
Router.get("/vcs/diff/:repoId/:filename", isAuthenticated, vcsController.getFileDiff);

// Merge operations
Router.post("/vcs/merge", isAuthenticated, vcsController.mergeBranch);
Router.post("/vcs/merge/abort", isAuthenticated, vcsController.abortMerge);

// Tag operations
Router.post("/vcs/tag/create", isAuthenticated, vcsController.createTag);
Router.get("/vcs/tags/:repoId", isAuthenticated, vcsController.listTags);
Router.delete("/vcs/tag/delete", isAuthenticated, vcsController.deleteTag);
Router.get("/vcs/tag/:repoId/:tagName", isAuthenticated, vcsController.getTagDetails);

// Stash operations
Router.post("/vcs/stash", isAuthenticated, vcsController.stashChanges);
Router.get("/vcs/stash/list/:repoId", isAuthenticated, vcsController.listStashes);
Router.post("/vcs/stash/apply", isAuthenticated, vcsController.applyStash);
Router.post("/vcs/stash/pop", isAuthenticated, vcsController.popStash);
Router.delete("/vcs/stash/clear/:repoId", isAuthenticated, vcsController.clearStashes);

module.exports = Router;

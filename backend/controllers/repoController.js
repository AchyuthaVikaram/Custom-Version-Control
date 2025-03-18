const createRepository = (req, res) => {
	res.send("reated a repo");
};

const getAllRepositories = (req, res) => {
	res.send("fetched all repositories");
};

const getRepositoryById = (req, res) => {
	res.send("fetched a repository by it's ID");
};
const getRepositoryByName = (req, res) => {
	res.send("fetched a repository by it's Name");
};

const fetchRepositoryForCurrUser = (req, res) => {
	res.send("fetched a repositories of a user");
};

const updateRepositoryById = (req, res) => {
	res.send("updated a repository by it's ID");
};
const deleteRepositoryById = (req, res) => {
	res.send("deleted a repository by it's ID");
};
const toggleVisibility = (req, res) => {
	res.send("toggle the visiblity of a repository");
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

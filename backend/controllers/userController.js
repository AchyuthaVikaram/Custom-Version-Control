const signup = (req, res) => {
	res.send("Signing up");
};
const login = (req, res) => {
	res.send("Logging in");
};
const getALlUsers = (req, res) => {
	res.send("ALl users fetched");
};

const getUserProfie = (req, res) => {
	res.send("User profile fetched");
};

const updateUserProfile = (req, res) => {
	res.send("User Profile updated");
};
const deleteUserProfile = (req, res) => {
	res.send("User Profile deleted");
};

module.exports = {
	signup,
	login,
	getALlUsers,
	getUserProfie,
	updateUserProfile,
	deleteUserProfile,
};

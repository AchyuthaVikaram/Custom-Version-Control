const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/userModel");
dotenv.config();

const isAuthenticated = async (req, res, next) => {
	try {
		const token = req.header("Authorization");
		if (!token) {
			return res
				.status(401)
				.json({ message: "Access denied. No token provided." });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
		const userId = decoded.userId;

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found." });
		}
		req.user = user;
		next();
	} catch (error) {
		return res.status(400).json({ message: "Invalid token." });
	}
};

module.exports = { isAuthenticated };

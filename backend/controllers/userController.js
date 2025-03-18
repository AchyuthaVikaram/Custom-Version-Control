const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel.js");
const dotenv = require("dotenv");
dotenv.config();

const signup = async (req, res) => {
	try {
		const { username, email, password } = req.body;
		if (!username || !email || !password) {
			return res.status(400).json({
				message: "All fields are mandatory!!",
			});
		}

		// Check if the user already exists
		let user = await User.findOne({ email });
		if (user) {
			return res.status(400).json({
				message: "User already exists with the provided email",
			});
		}

		// Hash the password
		const hashedPass = await bcrypt.hash(password, 15);

		// Create new user object
		user = new User({
			username,
			email,
			password: hashedPass,
		});

		// Save the new user to the database
		await user.save();

		const tokenData = {
			userId: user._id,
		};
		const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
			expiresIn: "1d", // Token expires in 1 day
		});
		return res.status(200).json({
			message: "User registered successfully",
			token,
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			message: "An error occurred during registration",
		});
	}
};
const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({
				message: "Email and password are mandatory!!",
			});
		}
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({
				message: "Invalid Credentials Entered",
			});
		}
		const isValidPassword = await bcrypt.compare(password, user.password);
		if (!isValidPassword) {
			return res.status(400).json({
				message: "Invalid password",
			});
		}
		const tokenData = {
			userId: user._id,
		};
		const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
			expiresIn: "1d",
		});
		return res.status(200).json({
			message: "User logged in successfully",
			token,
			userId: user._id,
		});
	} catch (error) {
		console.log(e);
		return res.status(500).json({
			message: "An error occurred during login",
		});
	}
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

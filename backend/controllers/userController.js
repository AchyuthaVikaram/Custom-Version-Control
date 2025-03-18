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
		console.log(error);
		return res.status(500).json({
			message: "An error occurred during login",
		});
	}
};
const getALlUsers = async (req, res) => {
	try {
		const users = await User.find({});
		return res
			.status(200)
			.json({ message: "All users fetched successfully", users });
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Server Error",
		});
	}
};

const getUserProfie = async (req, res) => {
	try {
		const userId = req.params.id;
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({
				message: "User not found",
			});
		}
		return res.status(200).json({
			message: "User profile fetched successfully",
			user,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Server Error",
		});
	}
};

const updateUserProfile = async (req, res) => {
	try {
		const userId = req.params.id;
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({
				message: "User not found",
			});
		}
		const { email, password } = req.body;
		const updatedData = {};
		if (email) updatedData.email = email;
		if (password) {
			const hashPass = await bcrypt.hash(password, 15);
			updatedData.password = hashPass;
		}
		Object.assign(user, updatedData);
		await user.save();
		return res
			.status(200)
			.json({ message: "Profile updated successfully", user });
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Server Error",
		});
	}
};
const deleteUserProfile = async (req, res) => {
	try {
		const userId = req.params.id;
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({
				message: "User not found",
			});
		}
		await User.findByIdAndDelete(userId);
		return res.status(200).json({
			message: "User deleted successfully",
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Server Error",
		});
	}
};

module.exports = {
	signup,
	login,
	getALlUsers,
	getUserProfie,
	updateUserProfile,
	deleteUserProfile,
};

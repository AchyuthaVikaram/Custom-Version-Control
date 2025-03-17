const mongoose = require("mongoose");
const  Schema  = mongoose.Schema;

const UserSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	repositories: [
		{
			type: Schema.Types.ObjectId,
			ref: "Repository",
			default: [],
		},
	],
	following: [
		{
			type: Schema.Types.ObjectId,
			ref: "User",
			default: [],
		},
	],
	followers: [
		{
			type: Schema.Types.ObjectId,
			ref: "User",
			default: [],
		},
	],
	starRepositories: [
		{
			type: Schema.Types.ObjectId,
			ref: "Repository",
			default: [],
		},
	],
});

const User = mongoose.model("User", UserSchema);
module.exports = User;

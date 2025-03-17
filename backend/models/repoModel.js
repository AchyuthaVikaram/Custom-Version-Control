const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RepositorySchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	description: {
		type: String,
		unique: true,
	},
	content: [
		{
			type: String,
		},
	],
	visibility: {
		type: Boolean,
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	issues: [
		{
			type: Schema.Types.ObjectId,
			ref: "Issue",
			required: true,
		},
	],
});
module.exports = mongoose.model("Repository", RepositorySchema);
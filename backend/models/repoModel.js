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
		},
	],
	language: {
		type: String,
		default: "JavaScript"
	},
	stars: {
		type: Number,
		default: 0
	},
	forks: {
		type: Number,
		default: 0
	},
	watchers: {
		type: Number,
		default: 0
	}
}, {
	timestamps: true
});
module.exports = mongoose.model("Repository", RepositorySchema);
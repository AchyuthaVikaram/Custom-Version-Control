const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IssueSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		enum: ["open", "closed", "in_progress"],
		default: "open",
	},
	priority: {
		type: String,
		enum: ["low", "medium", "high"],
		default: "medium",
	},
	labels: [{
		type: String
	}],
	author: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	repository: {
		type: Schema.Types.ObjectId,
		ref: "Repository",
		required: true,
	},
}, {
	timestamps: true
});
module.exports = mongoose.model("Issue", IssueSchema);

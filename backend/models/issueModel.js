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
		enum: ["Open", "Close"],
		default: "Open",
	},
	repository: {
		type: Schema.Types.ObjectId,
		ref: "Repository",
		required: true,
	},
});
module.exports = mongoose.model("Issue", IssueSchema);

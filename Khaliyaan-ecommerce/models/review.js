var mongoose = require("mongoose");

var reviewSchema = new mongoose.Schema({
	title: String,
	text: String,
	date: {type: Date, default: Date.now},
	user: String
});

module.exports = mongoose.model('Review',reviewSchema);
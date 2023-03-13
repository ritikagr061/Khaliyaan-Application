var mongoose = require("mongoose");

var orderCountSchema = new mongoose.Schema({
	count: Number
});

module.exports = mongoose.model('OrderCount',orderCountSchema);
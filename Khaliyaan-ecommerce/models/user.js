var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	cart: {
		items: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
	         		ref: "Product"
				},
				qty: Number
			}
		],
		cart_total: {type: Number, default: 0},
		discount: {type: Number, default: 0},
		total: {type: Number, default: 0}
	},
	orders: [
		{
			type: mongoose.Schema.Types.ObjectId,
	        ref: "Order"
		}
	]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);
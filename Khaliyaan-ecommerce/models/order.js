var mongoose = require("mongoose");

var orderSchema = new mongoose.Schema({
	no: Number,
	date: {type: Date, default: Date.now},
	name: String,
	address: {
		addr: String,
		city: String,
		state: String,
		pin: String
	},
	contactNo: Number,
	paymentMode: String,
	checkoutCart: {
		items: [
			{
				product: {
					id: String,
					name: String,
					image: String,
					mrp: Number,
					price: Number,
					disc_perc: Number,
					discount: Number
				},
				qty: Number
			}
		],
		cart_total: Number,
		discount: Number,
		total: Number
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
	    ref: "User"
	}
});

module.exports = mongoose.model('Order',orderSchema);
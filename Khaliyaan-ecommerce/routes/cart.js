var express = require("express");
var router = express.Router();
var Product = require("../models/product");
var User = require("../models/user");

router.get("/new/:id/:return",inCart,function(req,res){
	var cartItem = {
		product: req.params.id,
		qty: 1
	}
	req.user.cart.items.unshift(cartItem);
	Product.findById(req.params.id,function(err,product){
		if(err || !product) {
			req.flash("error","Product not found!!");
			res.redirect("/products");
		} else {
			req.user.cart.cart_total+=product.mrp;
			req.user.cart.discount+=product.discount;
			req.user.cart.total+=product.price;
			req.user.save();
		}
	});
	req.flash("success","Product added to Cart!!");
	if(req.params.return=="show") {
		res.redirect("/products/" + req.params.id);
	} else {
		res.redirect("/products");
	}
});

router.get("/",isLoggedIn,function(req,res){
	User.findById(req.user._id).populate("cart.items.product").exec(function(err,user){
		if(err || !user) {
			req.flash("error","Something went wrong!!");
			res.redirect("/products");
		} else {
			res.render("cart/show",{user: user});
		}
	});
});

router.get("/:id/:action",isLoggedIn,function(req,res){
	User.findById(req.user._id).populate("cart.items.product").exec(function(err,user){
		if(err || !user) {
			req.flash("error","Something went wrong!!");
			res.redirect("/products");
		} else {
			for(var i = user.cart.items.length - 1; i >= 0; i--) {
				var cartItem = user.cart.items[i];
				if(cartItem.product._id.equals(req.params.id)){
					if(req.params.action=='rem') {
						user.cart.cart_total-=(cartItem.product.mrp*cartItem.qty);
						user.cart.discount-=(cartItem.product.discount*cartItem.qty);
						user.cart.total-=(cartItem.product.price*cartItem.qty);
						user.cart.items.splice(i,1);
					} else {
						if(req.params.action=='inc'){
							user.cart.cart_total+=cartItem.product.mrp;
							user.cart.discount+=cartItem.product.discount;
							user.cart.total+=cartItem.product.price;
							cartItem.qty++;
						} else if(req.params.action=='dec') {
							user.cart.cart_total-=cartItem.product.mrp;
							user.cart.discount-=cartItem.product.discount;
							user.cart.total-=cartItem.product.price;
							cartItem.qty--;
							if(cartItem.qty==0) {
								user.cart.items.splice(i,1);
							}
						}
					}
					break;
				}
			}
			user.save();
			req.flash("success","Cart updated!!");
			res.redirect("/cart");
		}
	});
});

function inCart(req,res,next) {
	if(req.isAuthenticated()) {
		if(req.user.cart.items.some(function(cartItem){
			return cartItem.product._id.equals(req.params.id);
		})) {
			req.flash("error","This product is already present in your cart!!");
			res.redirect("/products");
		} else {
			next();
		}
	} else {
		req.flash("error","Login to continue!!");
		res.redirect("/login");
	}
}

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","Login to continue!!");
	res.redirect("/login");
}

module.exports = router;
var express = require("express");
var router = express.Router();
var Product = require("../models/product");
var Review = require("../models/review");

router.get("/products/:id/reviews/new",isLoggedIn,function(req,res){
	Product.findById(req.params.id,function(err,product){
		if(err || !product) {
			req.flash("error","Product not found!!");
			res.redirect("/products");
		} else {
			res.render("reviews/new",{product: product});
		}
	});
});

router.post("/products/:id",isLoggedIn,function(req,res){
	Product.findById(req.params.id,function(err,product){
		if(err || !product) {
			req.flash("error","Product not found!!");
			res.redirect("/products");
		} else {
			Review.create(req.body.review,function(err,review){
				if(err) {
					req.flash("error","Something went wrong!!");
					res.redirect("/products");
				} else {
					review.user=req.user.username;
					review.save();
					product.reviews.push(review);
					product.save();
					req.flash("success","Review added!!");
					res.redirect("/products/" + product._id);
				}
			});
		}
	});
});

router.get("/products/:id/reviews/:review_id/edit",reviewOwnership,function(req,res){
	Product.findById(req.params.id,function(err,product){
		if(err || !product) {
			req.flash("error","Product not found!!");
			res.redirect("/products");
		} else {
			Review.findById(req.params.review_id,function(err,review){
				if(err || !review) {
					req.flash("error","Review not found!!");
					res.redirect("/products");
				} else {
					res.render("reviews/edit",{product: product, review: review});
				}
			});
		}
	});
});

router.put("/products/:id/reviews/:review_id",reviewOwnership,function(req,res){
	Product.findById(req.params.id,function(err,product){
		if(err || !product) {
			req.flash("error","Product not found!!");
			res.redirect("/products");
		} else {
			Review.findByIdAndUpdate(req.params.review_id,req.body.review,function(err,review){
				if(err || !review) {
					req.flash("error","Review not found!!");
					res.redirect("/products");
				} else {
					req.flash("success","Review edited!!");
					res.redirect("/products/" + product._id);
				}
			});
		}
	});
});

router.delete("/products/:id/reviews/:review_id",reviewOwnership,function(req,res){
	Product.findById(req.params.id,function(err,product){
		if(err || !product) {
			req.flash("error","Product not found!!");
			res.redirect("/products");
		} else {
			Review.findByIdAndRemove(req.params.review_id,function(err){
				if(err) {
					req.flash("error","Something went wrong!!");
					res.redirect("/products");
				} else {
					req.flash("success","Review removed!!");
					res.redirect("/products/" + product._id);
				}
			});
		}
	});
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","Login to continue!!");
	res.redirect("/login");
}

function reviewOwnership(req,res,next) {
	if(req.isAuthenticated()) {
		Review.findById(req.params.review_id,function(err,review){
			if(err) {
				req.flash("error","Review not found!!");
				res.redirect("/products/" + req.params.id);
			} else {
				if(review.user==req.user.username) {
					next();
				} else {
					req.flash("error","Permission Denied!!");
					res.redirect("/products/" + req.params.id);
				}
			}
		});
	} else {
		req.flash("error","Login to continue!!");
		res.redirect("/login");
	}
}

module.exports = router;
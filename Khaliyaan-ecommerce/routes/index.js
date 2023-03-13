var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/",function(req,res){
	res.redirect("/products");
});

router.get("/register",function(req,res){
	res.render("index/register");
});

router.post("/register",function(req,res){
	var newUser = new User({username: req.body.username});
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			req.flash("error",err.message);
			res.redirect("/register");
		} else {
			passport.authenticate("local")(req,res,function(){
				req.flash("success","Hi " + user.username + ", Welcome to My Store!")
				res.redirect("/products");
			});
		}
	});
});

router.get("/login",function(req,res){
	res.render("index/login");
});

router.post("/login",passport.authenticate("local",{
	successRedirect: "/products",
	failureRedirect: "/login",
	failureFlash: true
}),function(req,res){
});

router.get("/logout",function(req,res){
	req.logout((err)=>{
		if(err){
			console.log(err);
		} else {
			req.flash("success","Logged you out!");
			res.redirect("/products");
		}
	});
});

module.exports = router;
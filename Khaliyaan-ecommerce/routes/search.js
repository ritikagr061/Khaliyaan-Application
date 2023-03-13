const router = require("express").Router();
var Product = require("../models/product");

router.get("/", (req, res) => {
    const searchItem = req.query.q;
    // console.log(searchItem);
    Product.find({
        $or: [ 
            { name: { $regex: `.*${searchItem}.*`, $options : 'i' } }, 
            { category: { $regex: `.*${searchItem}.*`, $options : 'i' } }
        ]
    },function(err,products){
		if(err){
            console.log(err);
			req.flash("error","Something went wrong!!");
			res.redirect("/products");
		} else {
            // console.log(products);
			res.render("search/index",{products});
		}
	});
})

module.exports = router;
let express = require("express"),
	router = express.Router({mergeParams: true}),
	Location = require("../models/location"),
	Comment = require("../models/comment")

//no longer need to do "/location" bc within main.js we did app.use("/location", LocationRoutes) which appends that url for us before the urls we put here.
//BUT req.params.id will no longer work bc it gets the params from the url you provided here directly, so need to merge them when requiring at the start with router = express.Router({mergeParams: true}) 
router.get("/add", isLoggedIn, (req, res) =>{
	Location.findById(req.params.id, (err, foundLocation) => {
		if (err) console.log(err);
		else res.render("comments/add", {location: foundLocation});
	});
})

router.post("/", isLoggedIn, async function (req, res){
	let location = await Location.findById(req.params.id);
	let newComment = await Comment.create({author: req.body.comment.author, text: req.body.comment.text});
	location.comments.push(newComment);
	location.save();
	res.redirect("/locations/" + location._id);	
})

function isLoggedIn(req, res, next){ 
	if(req.isAuthenticated()){ 
		return next();
	}
	res.redirect("/login");
}


module.exports = router;
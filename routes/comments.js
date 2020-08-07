let express = require("express"),
	router = express.Router({mergeParams: true}),
	Location = require("../models/location"),
	Comment = require("../models/comment")

router.get("/add", isLoggedIn, (req, res) =>{
	Location.findById(req.params.id, (err, foundLocation) => {
		if (err) console.log(err);
		else res.render("comments/add", {location: foundLocation});
	});
})

router.post("/", isLoggedIn, async function (req, res){
	let location = await Location.findById(req.params.id);
	let newComment = await Comment.create({text: req.body.comment.text}); //create comment
	//add userid using the req.user from passport which is only there if logged in
	newComment.author.id = req.user._id;
	newComment.author.username = req.user.username;
	newComment.save(); //save to comment collection in db
	//then save comment into location
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
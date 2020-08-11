let express = require("express"),
	router = express.Router({mergeParams: true}),
	Location = require("../models/location"),
	Comment = require("../models/comment"),
	mid = require("../middleware/middleware")

/*	POST COMMENT
==========================*/
router.get("/add", mid.isLoggedIn, (req, res) =>{
	Location.findById(req.params.id, (err, foundLocation) => {
		if (err) console.log(err);
		else res.render("comments/add", {location: foundLocation});
	});
})

router.post("/", mid.isLoggedIn, async function (req, res){
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


/*	UPDATE COMMENT
==========================*/
//you can only get to the edit comment page if own the comment
router.get("/:comment_id/edit", mid.checkCommentOwnership, (req, res)=>{
		Comment.findById(req.params.comment_id, (err, foundComment)=>{
				res.render("comments/edit", {location_id: req.params.id, comment:foundComment})
	})
})

//you can only actually post if you own the comment, need this in case they bypase the .get through postman
router.put("/:comment_id", mid.checkCommentOwnership, (req, res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, foundComment)=>{
		res.redirect("/locations/" + req.params.id);
	})
})

/*	DELETE COMMENT
==========================*/
router.delete("/:comment_id",  mid.checkCommentOwnership, (req, res)=>{
	Comment.findByIdAndDelete(req.params.comment_id, (err)=>{
		console.log("comment deleted")
		res.redirect("/locations/" + req.params.id);
	})
})

module.exports = router;
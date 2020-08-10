let express = require("express"),
	router = express.Router({mergeParams: true}),
	Location = require("../models/location"),
	Comment = require("../models/comment")

/*	POST COMMENT
==========================*/
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


/*	UPDATE COMMENT
==========================*/
//you can only get to the edit comment page if own the comment
router.get("/:comment_id/edit", checkCommentOwnership, (req, res)=>{
		Comment.findById(req.params.comment_id, (err, foundComment)=>{
				res.render("comments/edit", {location_id: req.params.id, comment:foundComment})
	})
})

//you can only actually post if you own the comment, need this in case they bypase the .get through postman
router.put("/:comment_id", checkCommentOwnership, (req, res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, foundComment)=>{
		res.redirect("/locations/" + req.params.id);
	})
})
/*	DELETE COMMENT
==========================*/



//==================================
function isLoggedIn(req, res, next){ 
	if(req.isAuthenticated()){ 
		return next();
	}
	res.redirect("/login");
}


function checkCommentOwnership(req, res, next){
	if(req.isAuthenticated()) { //if user is loggedin
		Comment.findById(req.params.comment_id, (err, foundComment)=>{ //find comment
			if(err) res.send("can't find comment");
			else {
				if(foundComment.author.id.equals(req.user._id)){ //if user loggedin is same as comment author
					next();
				} 
				else {
					res.send("author not same");
				}
			}
		})
	} else {
		//if user not logged in 
		res.redirect("back");
	}
}






module.exports = router;
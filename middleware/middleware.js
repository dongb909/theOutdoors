let Location = require("../models/location"),
	Comment = require("../models/comment")


let middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next)=>{ 
	if(req.isAuthenticated()){ 
		return next();
	}
	req.flash("flashMessageError", "You need to be logged in to do that!");
	res.redirect("/login");
}

	
middlewareObj.checkLocationOwnership = (req, res, next)=>{
	if(req.isAuthenticated()) { 
		Location.findById(req.params.id, (err, foundLocation)=>{
			if(err) {
				req.flash("flashMessageError", "Location not found");
				res.redirect("back");
			} else {
				if(foundLocation.author.id.equals(req.user._id)){
					next();
				} 
				else {
					req.flash("flashMessageError", "You don't have permission to do that")
					res.redirect("back");
				}
			}
		})
	} else {
		req.flash("flashMessageError", "You need to be logged in to do that!");
		res.redirect("back");
	}
}
	
	
	
middlewareObj.checkCommentOwnership = (req, res, next)=>{
	if(req.isAuthenticated()) { //if user is loggedin
		Comment.findById(req.params.comment_id, (err, foundComment)=>{ //find comment
			if(err) {
				req.flash("flashMessageError", "Comment not found")
				res.redirect("back");
			} else {
				if(foundComment.author.id.equals(req.user._id)){ //if user loggedin is same as comment author
					//cannot use triple equals with mongoose id
					next();
				} 
				else {
					req.flash("flashMessageError", "You don't have permission to do that")
					res.redirect("back");
				}
			}
		})
	} else {
		//if user not logged in 
		res.redirect("back");
	}
}

module.exports = middlewareObj;
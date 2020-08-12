let Location = require("../models/location"),
	Comment = require("../models/comment")


let middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next)=>{ 
	if(req.isAuthenticated()){ 
		return next();
	}
	req.flash("message", "Please Login First!");
	res.redirect("/login");
}

	
middlewareObj.checkLocationOwnership = (req, res, next)=>{
	if(req.isAuthenticated()) { 
		Location.findById(req.params.id, (err, foundLocation)=>{
			if(err) res.send("can't find location");
			else {
				if(foundLocation.author.id.equals(req.user._id)){
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
	
	
	
middlewareObj.checkCommentOwnership = (req, res, next)=>{
	if(req.isAuthenticated()) { //if user is loggedin
		Comment.findById(req.params.comment_id, (err, foundComment)=>{ //find comment
			if(err) res.send("can't find comment");
			else {
				if(foundComment.author.id.equals(req.user._id)){ //if user loggedin is same as comment author
					//cannot use triple equals with mongoose id
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

module.exports = middlewareObj;
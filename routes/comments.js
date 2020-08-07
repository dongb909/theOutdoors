app.get("/locations/:id/comments/add", isLoggedIn, (req, res) =>{
	Location.findById(req.params.id, (err, foundLocation) => {
		if (err) console.log(err);
		else res.render("comments/add", {location: foundLocation});
	});
})

app.post("/locations/:id/comments", isLoggedIn, async function (req, res){
	let location = await Location.findById(req.params.id);
	let newComment = await Comment.create({author: req.body.comment.author, text: req.body.comment.text});
	location.comments.push(newComment);
	location.save();
	res.redirect("/locations/" + location._id);	
})

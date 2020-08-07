let express = require("express"),
	router = express.Router(),
	Location = require("../models/location")
	

router.get("/", (req, res)=>{
	Location.find({}, (err, allLocations)=>{
		if (err){
			console.log(err)
		} else {
			res.render("locations/index", {locations: allLocations}); 
		}
	})
	
});

router.post("/", isLoggedIn, (req, res)=>{
	let name = req.body.name,
		image = req.body.image,
		description = req.body.description,
		author = {id: req.user._id,
				 username: req.user.username},
		newLocation = {name, image, description, author}
	Location.create(newLocation, (err, newCreation)=>{
		if(err){
			console.log(err)
		} else {
			res.redirect("/locations")
		}
	})
});

router.get("/add", isLoggedIn, (req, res)=>{
	res.render("locations/add")
});

router.get("/:id", (req, res)=>{
	Location.findById(req.params.id).populate("comments").exec((err, foundLocation)=>{
		if (err) console.log(err);
		else {
			res.render("locations/show", {location: foundLocation});
		}
	})
})


function isLoggedIn(req, res, next){ 
	if(req.isAuthenticated()){ 
		return next();
	}
	res.redirect("/login");
}

module.exports = router;
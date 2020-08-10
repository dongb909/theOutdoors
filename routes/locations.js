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


/*	POST LOCATION
==========================*/
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


/*	UPDATE LOCATION
==========================*/
router.get("/:id/edit", checkLocationOwnership, (req, res)=>{
	Location.findById(req.params.id, (err, foundLocation)=>{
		res.render("locations/edit", {location: foundLocation});	
	})
})

router.put("/:id", checkLocationOwnership, (req, res)=>{
	Location.findByIdAndUpdate(req.params.id, req.body.location, (err, foundLocation)=>{ //id, data to update with, cb what to do after updated
		// if (err) res.redirect("/locations");
		res.redirect("/locations/" + req.params.id);	
	})
})

/*	DESTROY LOCATION
==========================*/
 router.delete("/:id", checkLocationOwnership, (req, res)=>{
	 Location.findByIdAndDelete(req.params.id, (err)=>{
		 // if (err) res.redirect("/locations")
		 res.redirect("/locations");
	 })
 })



//==============================
function isLoggedIn(req, res, next){ 
	if(req.isAuthenticated()){ 
		return next();
	}
	res.redirect("/login");
}

function checkLocationOwnership(req, res, next){
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



module.exports = router;
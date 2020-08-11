let express = require("express"),
	router = express.Router(),
	Location = require("../models/location"),
	mid = require("../middleware/middleware")

	

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
router.post("/", mid.isLoggedIn, (req, res)=>{
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

router.get("/add", mid.isLoggedIn, (req, res)=>{
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
router.get("/:id/edit", mid.checkLocationOwnership, (req, res)=>{
	Location.findById(req.params.id, (err, foundLocation)=>{
		res.render("locations/edit", {location: foundLocation});	
	})
})

router.put("/:id", mid.checkLocationOwnership, (req, res)=>{
	Location.findByIdAndUpdate(req.params.id, req.body.location, (err, foundLocation)=>{ //id, data to update with, cb what to do after updated
		// if (err) res.redirect("/locations");
		res.redirect("/locations/" + req.params.id);	
	})
})

/*	DESTROY LOCATION
==========================*/
 router.delete("/:id", mid.checkLocationOwnership, (req, res)=>{
	 Location.findByIdAndDelete(req.params.id, (err)=>{
		 // if (err) res.redirect("/locations")
		 res.redirect("/locations");
	 })
 })



module.exports = router;
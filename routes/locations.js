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
		// if (err) res.redirect("/locations"); DON'T NEED TO CHECK FOR ERRORS ANYMORE SINCE MIDDLEWARE FUNCTION ALREADY LOOKS FOR THE ID , ONLY IF IT SUCCEEDS DOES NEXT() GET EXECUTED TO GO TO THIS ROUTE HANDLER CB, and err is handled by it also
		res.render("locations/edit", {location: foundLocation});	
	})
})

router.put("/:id", checkLocationOwnership, (req, res)=>{
	Location.findByIdAndUpdate(req.params.id, req.body.location, (err, foundLocation)=>{
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
	//check if user is logged in
	if(req.isAuthenticated()) { //better to do this than using isLoggedIn bc that's another middleware vs using passport
		Location.findById(req.params.id, (err, foundLocation)=>{
			if(err) res.send("can't find location");
			//check if user is same as the author's id NOT username
			else {
				if(foundLocation.author.id.equals(req.user._id)){
					//CANNOT DO req.user._id === foundLocation.auther.id bc though the ids are the same, the TYPES are diff. 
		//-req.user._id is a STRING, foundLocation.auther.id is an OBJECT REFERENCE
		//-so in order to compare this, use a method mongoose provides
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
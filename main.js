let express 	= require("express"),
	app     	= express(),
	bodyParser 	= require("body-parser"),
	mongoose 	= require("mongoose"),
	Location 	= require("./models/location"),
	Comment  	= require("./models/comment")
	// seedDB		= require("./seeds")

mongoose.connect("mongodb://localhost/the_outdoors", {useNewUrlParser: true, useUnifiedTopology: true}) 
app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine", "ejs")


app.get("/", (req, res)=>{
	res.render("landing")
});

app.get("/locations", (req, res)=>{
	Location.find({}, (err, allLocations)=>{
		if (err){
			console.log(err)
		} else {
			res.render("index", {locations: allLocations}); 
		}
	})
});

app.post("/locations", (req, res)=>{
	let name = req.body.name,
		image = req.body.image,
		description = req.body.description,
		newLocation = {name, image, description}
	Location.create(newLocation, (err, newCreation)=>{
		if(err){
			console.log(err)
		} else {
			res.redirect("/locations")
		}
	})
});

app.get("/locations/add", (req, res)=>{
	res.render("add")
});

//.populate adds the actual comments to our objs instead of the ids references
//.exec is a function that lets you execute your own code after a promise is returned
app.get("/locations/:id", (req, res)=>{
	Location.findById(req.params.id).populate("comments").exec((err, foundLocation)=>{
		if (err) console.log(err);
		else {
			// console.log(foundLocation)
			res.render("show", {location: foundLocation});
		}
	})
})

app.listen(3000, ()=>{
	console.log("server has started!!")
});
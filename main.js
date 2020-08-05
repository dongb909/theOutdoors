let express 	= require("express"),
	app     	= express(),
	bodyParser 	= require("body-parser"),
	mongoose 	= require("mongoose"),
	Location 	= require("./models/location"),
	Comment  	= require("./models/comment")
	// seedDB		= require("./seeds")


/*========================
	CONNECTION
==========================*/
mongoose.connect("mongodb://localhost/the_outdoors", {useNewUrlParser: true, useUnifiedTopology: true}) 
app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine", "ejs")

/*========================
	LOCATION ROUTES
==========================*/
app.get("/", (req, res)=>{
	res.render("landing")
});

app.get("/locations", (req, res)=>{
	Location.find({}, (err, allLocations)=>{
		if (err){
			console.log(err)
		} else {
			res.render("locations/index", {locations: allLocations}); 
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
	res.render("locations/add")
});

//.populate adds the actual comments to our objs instead of the ids references
//.exec is a function that lets you execute your own code after a promise is returned
app.get("/locations/:id", (req, res)=>{
	Location.findById(req.params.id).populate("comments").exec((err, foundLocation)=>{
		if (err) console.log(err);
		else {
			// console.log(foundLocation)
			res.render("locations/show", {location: foundLocation});
		}
	})
})

/*========================
	COMMENT ROUTES
==========================*/

app.get("/locations/:id/comments/add", (req, res) =>{
	Location.findById(req.params.id, (err, foundLocation) => {
		if (err) console.log(err);
		else res.render("comments/add", {location: foundLocation});
	});
})

app.post("/locations/:id/comments", async function (req, res){
	let location = await Location.findById(req.params.id);
	let newComment = await Comment.create({author: req.body.comment.author, text: req.body.comment.text});
	location.comments.push(newComment);
	location.save();	//do not do .populate here, you're using async await, NOT promises this way
	res.redirect("/locations/" + location._id);	//NO HAVE TO PUT IN THE ACTUAL ID, ":ID" DOES NOT WORK because this is treated as a STRING, so :id will not convert to a number
})

app.listen(3000, ()=>{
	console.log("server has started!!")
});
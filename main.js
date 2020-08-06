let express 	= require("express"),
	app     	= express(),
	bodyParser 	= require("body-parser"),
	mongoose 	= require("mongoose"),
	Location 	= require("./models/location"),
	Comment  	= require("./models/comment"),
	passport	= require("passport"),
	LocalStrategy = require("passport-local"),
	User 		= require("./models/user"),
	expressSession = require("express-session")
	// seedDB		= require("./seeds")


/*========================
	CONNECTION
==========================*/
mongoose.connect("mongodb://localhost/the_outdoors", {useNewUrlParser: true, useUnifiedTopology: true}) 
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(__dirname + "/public"))
app.set("view engine", "ejs") 

/*========================
	PASSPORT CONFIGURATION
==========================*/
app.use(expressSession({
	secret: "Hi my name is Rachel!",
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

app.get("/locations/:id", (req, res)=>{
	Location.findById(req.params.id).populate("comments").exec((err, foundLocation)=>{
		if (err) console.log(err);
		else {
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
	location.save();
	res.redirect("/locations/" + location._id);	
})

/*========================
	AUTH ROUTES
==========================*/

app.listen(3000, ()=>{
	console.log("server has started!!")
});
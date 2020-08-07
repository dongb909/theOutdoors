let express 	= require("express"),
	app     	= express(),
	bodyParser 	= require("body-parser"),
	mongoose 	= require("mongoose"),
	Location 	= require("./models/location"),
	Comment  	= require("./models/comment")
	passport	= require("passport"),
	LocalStrategy = require("passport-local"),
	User 		= require("./models/user"),
	expressSession = require("express-session")
	// seedDB		= require("./seeds")


/*========================
	CONNECTION
==========================*/
mongoose.connect("mongodb://localhost/the_outdoors", {useNewUrlParser: true, useUnifiedTopology: true}); 
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs"); 

/*========================
	PASSPORT CONFIGURATION
==========================*/
app.use(expressSession({
	secret: "Hi my name is Rachel!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize()); 
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
	res.locals.currentUser = req.user; //will be empty if no one signed in
	next();
})//this is a middleware that will run with each route to be available to every template instead of having to add it in to each route template data (ex: res.render("locations/index", {locations: allLocations, currentUser: req.user}); )
//req.user is only available if passport created a user upon registration or login through authenticate(), it comes from the req that's sent from browser tat was stored there from a previous response obj to the local browser, just username and _id

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

/*========================
	AUTH ROUTES
==========================*/
app.get("/register", (req, res)=>{
	res.render("register")
});

app.post("/register", (req,res)=>{
	let newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user)=>{
		if (err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, ()=>{
			res.redirect("/locations")
		})
	})
})

/*========================
	LOGIN ROUTES
==========================*/
app.get("/login", (req, res)=>{
	res.render("login")
});

app.post("/login", passport.authenticate("local", {
	successRedirect: "/locations",
	failureRedirect: "/login"
}), (err,res)=>{});
//authenticate compares body with db on its own. the cb isn't needed but just there so you remember it's a middleware. Is the same authenicate as with register, but for register, you're making the user first and then signing them in

/*========================
	LOGIN ROUTES
==========================*/
app.get("/logout", (req, res)=>{
	req.logout();
	res.redirect("/locations")
})

/*========================
	MIDDLEWARE
==========================*/
//only allow users to do something if they're logged something
function isLoggedIn(req, res, next){ //express knows what you place in these params
	if(req.isAuthenticated()){ //if passport method returns true
		return next();
	}
	res.redirect("/login");
}


app.listen(3000, ()=>{
	console.log("server has started!!")
});
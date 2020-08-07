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

let commentRoutes = require("/routes/comments"),
	locationRoutes = require("/routes/locations"),
	indexRoutes = require("/routes/index")

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


/*========================
	COMMENT ROUTES
==========================*/

/*========================
	AUTH ROUTES
==========================*/


/*========================
	LOGIN ROUTES
==========================*/

/*========================
	LOGIN ROUTES
==========================*/



app.listen(3000, ()=>{
	console.log("server has started!!")
});
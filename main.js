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

let commentRoutes = require("./routes/comments"),
	locationRoutes = require("./routes/locations"),
	indexRoutes = require("./routes/index")

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

app.use((req,res,next)=>{	//MUST BE BEFORE USING ROUTES!!
	res.locals.currentUser = req.user; 
	next();
});

app.use(indexRoutes);
app.use("/locations/:id/comments", commentRoutes);
app.use("/locations", locationRoutes); //will append /locations to all urls in location routes

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